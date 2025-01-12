import React from 'react';
import styles from  './index.module.css';

const Canvas = ({ children, style }) => {
    return <div className={styles.canvas} style={style}>{children}</div>;
};

export default Canvas;