"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, X, Camera, ImageIcon, Trash2, Shield } from "lucide-react";
import { PhotoGallery } from "@/components/PhotoGallery";
import { FadeInUp } from "@/components/animations/FadeInUp";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAdmin } from "@/contexts/AdminContext";
import imageCompression from "browser-image-compression";
import { supabase } from "@/lib/supabase";

interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
}

interface FileWithPreview {
  file: File;
  preview: string;
}

export default function GaleriaPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadForm, setUploadForm] = useState({
    name: "",
    caption: "",
  });
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const { isAdmin } = useAdmin();

  // Fetch images from Supabase on mount
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setImages(
        (data || []).map((img: { id: string; image_url: string; caption?: string }) => ({
          id: img.id,
          url: img.image_url,
          caption: img.caption || undefined,
        }))
      );
    } catch (err) {
      console.error("Error fetching images:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (imageId: string, imageUrl: string) => {
    if (!confirm("¿Estas seguro de que quieres eliminar esta foto?")) return;

    setDeleting(imageId);
    try {
      // Extract filename from URL
      const fileName = imageUrl.split("/").pop();

      // Delete from storage
      if (fileName) {
        await supabase.storage.from("bucket").remove([fileName]);
      }

      // Delete from database
      const { error } = await supabase
        .from("gallery_images")
        .delete()
        .eq("id", imageId);

      if (error) throw error;

      // Remove from local state
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      console.error("Error deleting image:", err);
      alert("Error al eliminar la imagen");
    } finally {
      setDeleting(null);
    }
  };

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const newFiles: FileWithPreview[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Create preview
        const preview = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        // Compress image
        try {
          const options = {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          };
          const compressedFile = await imageCompression(file, options);
          newFiles.push({ file: compressedFile, preview });
        } catch (error) {
          console.error("Error compressing image:", error);
          newFiles.push({ file, preview });
        }
      }

      setSelectedFiles((prev) => [...prev, ...newFiles]);
    },
    []
  );

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !uploadForm.name.trim()) return;

    setUploading(true);
    setError(null);
    setUploadProgress({ current: 0, total: selectedFiles.length });

    const uploadedImages: GalleryImage[] = [];

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const { file } = selectedFiles[i];
        setUploadProgress({ current: i + 1, total: selectedFiles.length });

        // Generate unique filename
        const fileExt = file.name.split(".").pop() || "jpg";
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("bucket")
          .upload(fileName, file);

        if (uploadError) {
          throw new Error(`Error al subir foto ${i + 1}: ${uploadError.message}`);
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("bucket")
          .getPublicUrl(fileName);

        // Save to database
        const { data: insertedData, error: dbError } = await supabase
          .from("gallery_images")
          .insert({
            image_url: urlData.publicUrl,
            uploaded_by: uploadForm.name,
            caption: uploadForm.caption || null,
          })
          .select()
          .single();

        if (dbError) {
          throw new Error(`Error al guardar foto ${i + 1}: ${dbError.message}`);
        }

        uploadedImages.push({
          id: insertedData.id,
          url: urlData.publicUrl,
          caption: uploadForm.caption || `Subida por ${uploadForm.name}`,
        });
      }

      // Add all to local state
      setImages((prev) => [...uploadedImages, ...prev]);

      // Reset form
      setUploadForm({ name: "", caption: "" });
      setSelectedFiles([]);
      setShowUpload(false);
    } catch (err) {
      console.error("Error uploading images:", err);
      setError(err instanceof Error ? err.message : "Error al subir las imagenes");
      // Still add successfully uploaded images
      if (uploadedImages.length > 0) {
        setImages((prev) => [...uploadedImages, ...prev]);
      }
    } finally {
      setUploading(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  };

  return (
    <div className="min-h-screen px-4 py-6">
      {/* Header */}
      <FadeInUp>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-serif font-bold text-primary">
              Galeria
            </h1>
            <p className="text-sm text-primary/60">
              Fotos de Hacienda San Pedro Palomeque
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowUpload(true)}
          >
            <Camera size={18} className="mr-1" />
            Subir
          </Button>
        </div>
      </FadeInUp>

      {/* Upload Modal */}
      {showUpload && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[60] bg-black/50 flex items-end sm:items-center justify-center"
          onClick={() => setShowUpload(false)}
        >
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl flex flex-col max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fixed Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-cream">
              <h2 className="text-lg font-semibold text-primary">
                Subir Fotos
              </h2>
              <button
                onClick={() => {
                  setShowUpload(false);
                  setSelectedFiles([]);
                  setError(null);
                }}
                className="p-2 hover:bg-cream rounded-full"
              >
                <X size={20} className="text-primary" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 pt-4 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                  {error}
                </div>
              )}

              <Input
                label="Tu nombre"
                placeholder="Ej: Juan Perez"
                value={uploadForm.name}
                onChange={(e) =>
                  setUploadForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />

              <Input
                label="Descripcion (opcional, aplica a todas)"
                placeholder="Ej: Vista del jardin"
                value={uploadForm.caption}
                onChange={(e) =>
                  setUploadForm((prev) => ({
                    ...prev,
                    caption: e.target.value,
                  }))
                }
              />

              {/* File upload */}
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  Fotos {selectedFiles.length > 0 && `(${selectedFiles.length} seleccionadas)`}
                </label>

                {/* Selected files preview */}
                {selectedFiles.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {selectedFiles.map((item, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-cream">
                        <img
                          src={item.preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removeFile(index)}
                          className="absolute top-1 right-1 p-1 bg-black/50 rounded-full"
                        >
                          <X size={14} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add more files button */}
                <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-cream-dark rounded-xl cursor-pointer hover:bg-cream/50 transition-colors">
                  <Upload size={24} className="text-primary/40 mb-2" />
                  <span className="text-sm text-primary/60">
                    {selectedFiles.length > 0 ? "Agregar mas fotos" : "Toca para seleccionar"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </label>
              </div>
            </div>

            {/* Fixed Footer with Button */}
            <div className="p-6 pt-4 border-t border-cream pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <Button
                className="w-full"
                onClick={handleUpload}
                disabled={selectedFiles.length === 0 || !uploadForm.name.trim()}
                loading={uploading}
              >
                {uploading
                  ? `Subiendo ${uploadProgress.current}/${uploadProgress.total}...`
                  : `Subir ${selectedFiles.length} foto${selectedFiles.length !== 1 ? 's' : ''}`}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`skeleton rounded-xl ${
                i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-[4/3]" : "aspect-square"
              }`}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && images.length === 0 && (
        <FadeInUp>
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 bg-cream rounded-full flex items-center justify-center">
              <ImageIcon size={32} className="text-primary/40" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">
              No hay fotos aun
            </h3>
            <p className="text-sm text-primary/60 mb-4">
              Se el primero en compartir fotos del lugar
            </p>
            <Button onClick={() => setShowUpload(true)}>
              <Camera size={18} className="mr-2" />
              Subir primera foto
            </Button>
          </div>
        </FadeInUp>
      )}

      {/* Admin Mode Indicator */}
      {isAdmin && (
        <FadeInUp>
          <div className="mb-4 p-3 bg-accent/10 border border-accent/30 rounded-xl flex items-center gap-2">
            <Shield size={18} className="text-accent" />
            <span className="text-sm text-primary">
              Modo administrador: puedes eliminar fotos
            </span>
          </div>
        </FadeInUp>
      )}

      {/* Gallery Grid */}
      {!loading && images.length > 0 && (
        <FadeInUp delay={0.1}>
          {isAdmin ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
              {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative group rounded-xl overflow-hidden ${
                    index === 0
                      ? "col-span-2 row-span-2 aspect-square md:aspect-[4/3]"
                      : "aspect-square"
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.caption || "Foto de galeria"}
                    className="w-full h-full object-cover"
                  />
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <p className="text-white text-sm">{image.caption}</p>
                    </div>
                  )}
                  {/* Delete button for admin */}
                  <button
                    onClick={() => handleDelete(image.id, image.url)}
                    disabled={deleting === image.id}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity disabled:opacity-50"
                  >
                    {deleting === image.id ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 size={20} />
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <PhotoGallery images={images} />
          )}
        </FadeInUp>
      )}
    </div>
  );
}
