import React from 'react';
import styles from './index.module.css';

const Edge = ({ sourceX, sourceY, targetX, targetY, label }) => {
    const markerId = `arrowhead`;
    const midX = (sourceX + targetX) / 2;
    const midY = (sourceY + targetY) / 2;

    return (
        <svg className={styles.edge}>
            <defs>
                <marker
                    id={markerId}
                    markerWidth="10"
                    markerHeight="10"
                    refX="10"
                    refY="5"
                    orient="auto"
                    markerUnits="strokeWidth"
                >
                    <path d="M 0 0 L 10 5 L 0 10 Z" fill="#888" />
                </marker>
            </defs>
            <line
                x1={sourceX}
                y1={sourceY}
                x2={targetX}
                y2={targetY}
                stroke="#888"
                strokeWidth="2"
                strokeDasharray="5,5"
                markerEnd={`url(#${markerId})`}
            />

            {label && (
                <text
                    x={midX}
                    y={midY - 5}
                    fill="#333"
                    fontSize="12"
                    textAnchor="middle"
                    dominantBaseline="middle"
                >
                    {label}
                </text>
            )}
        </svg>
    );
};

export default Edge;