"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { FamilyMember } from "@/types";

interface TreeNode {
  member: FamilyMember;
  x: number;
  y: number;
  level: number;
  children: TreeNode[];
}

interface FamilyTreeProps {
  members: FamilyMember[];
  onEdit?: (member: FamilyMember) => void;
  onDelete?: (member: FamilyMember) => void;
}

const NODE_WIDTH = 160;
const NODE_HEIGHT = 80;
const LEVEL_HEIGHT = 150;
const SIBLING_SPACING = 40;

export function FamilyTree({ members, onEdit, onDelete }: FamilyTreeProps) {
  const { nodes, connections, svgWidth, svgHeight } = useMemo(() => {
    if (members.length === 0) {
      return { nodes: [], connections: [], svgWidth: 400, svgHeight: 200 };
    }

    // Build hierarchical tree structure
    const memberMap = new Map(members.map(m => [m.id, m]));

    // Find root members (no parents)
    const roots = members.filter(m => !m.mother_id && !m.father_id);

    // Build tree nodes recursively
    function buildNode(member: FamilyMember, level: number = 0): TreeNode {
      const children = members
        .filter(m => m.mother_id === member.id || m.father_id === member.id)
        .map(child => buildNode(child, level + 1));

      return {
        member,
        x: 0, // Will be calculated later
        y: level * LEVEL_HEIGHT + NODE_HEIGHT / 2,
        level,
        children,
      };
    }

    const rootNodes = roots.map(root => buildNode(root));

    // Calculate x positions using a tree layout algorithm
    function calculateWidth(node: TreeNode): number {
      if (node.children.length === 0) {
        return NODE_WIDTH;
      }
      return node.children.reduce((sum, child) => sum + calculateWidth(child), 0) +
        Math.max(0, node.children.length - 1) * SIBLING_SPACING;
    }

    function positionNode(node: TreeNode, startX: number): void {
      if (node.children.length === 0) {
        node.x = startX + NODE_WIDTH / 2;
        return;
      }

      let currentX = startX;
      node.children.forEach(child => {
        positionNode(child, currentX);
        currentX += calculateWidth(child) + SIBLING_SPACING;
      });

      // Center parent above children
      const firstChild = node.children[0];
      const lastChild = node.children[node.children.length - 1];
      node.x = (firstChild.x + lastChild.x) / 2;
    }

    let currentX = 20;
    rootNodes.forEach(root => {
      positionNode(root, currentX);
      currentX += calculateWidth(root) + SIBLING_SPACING * 3;
    });

    // Flatten nodes for rendering
    const allNodes: TreeNode[] = [];
    const allConnections: { from: TreeNode; to: TreeNode }[] = [];

    function collectNodes(node: TreeNode) {
      allNodes.push(node);
      node.children.forEach(child => {
        allConnections.push({ from: node, to: child });
        collectNodes(child);
      });
    }

    rootNodes.forEach(collectNodes);

    // Calculate SVG dimensions
    const maxX = Math.max(...allNodes.map(n => n.x), NODE_WIDTH) + NODE_WIDTH;
    const maxY = Math.max(...allNodes.map(n => n.y), LEVEL_HEIGHT) + NODE_HEIGHT;

    return {
      nodes: allNodes,
      connections: allConnections,
      svgWidth: Math.max(maxX, 400),
      svgHeight: Math.max(maxY, 200),
    };
  }, [members]);

  if (members.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-cream/50 rounded-xl">
        <p className="text-primary/60 text-center">
          No hay miembros en el árbol familiar aún.<br />
          Sé el primero en agregarte.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto bg-cream/30 rounded-xl p-4">
      <svg
        width={svgWidth}
        height={svgHeight}
        className="mx-auto"
        style={{ minWidth: "100%" }}
      >
        {/* Draw connections */}
        {connections.map((conn, idx) => {
          const fromX = conn.from.x;
          const fromY = conn.from.y + NODE_HEIGHT / 2;
          const toX = conn.to.x;
          const toY = conn.to.y - NODE_HEIGHT / 2;
          const midY = (fromY + toY) / 2;

          return (
            <motion.path
              key={`conn-${idx}`}
              d={`M ${fromX} ${fromY} L ${fromX} ${midY} L ${toX} ${midY} L ${toX} ${toY}`}
              stroke="#2B4B3C"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
            />
          );
        })}

        {/* Draw nodes */}
        {nodes.map((node, idx) => (
          <motion.g
            key={node.member.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            {/* Node background */}
            <rect
              x={node.x - NODE_WIDTH / 2}
              y={node.y - NODE_HEIGHT / 2}
              width={NODE_WIDTH}
              height={NODE_HEIGHT}
              rx="12"
              fill="white"
              stroke="#2B4B3C"
              strokeWidth="2"
              className="cursor-pointer hover:fill-cream/50 transition-colors"
              onClick={() => onEdit?.(node.member)}
            />

            {/* Name text */}
            <text
              x={node.x}
              y={node.y - 10}
              textAnchor="middle"
              className="text-sm font-semibold fill-primary pointer-events-none"
            >
              {node.member.first_name}
            </text>
            <text
              x={node.x}
              y={node.y + 10}
              textAnchor="middle"
              className="text-xs fill-primary/70 pointer-events-none"
            >
              {node.member.last_name}
            </text>
            {node.member.second_last_name && (
              <text
                x={node.x}
                y={node.y + 25}
                textAnchor="middle"
                className="text-xs fill-primary/70 pointer-events-none"
              >
                {node.member.second_last_name}
              </text>
            )}
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
