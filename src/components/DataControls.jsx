import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, Trash, FileText } from 'lucide-react';
import { exportToJSON, exportToCSV, importFromJSON } from '../utils/helpers';
import './DataControls.css';

const DataControls = ({ transactions, onImport, onClear }) => {
  const fileInputRef = useRef(null);

  const handleExportJSON = () => {
    exportToJSON(transactions);
  };

  const handleExportCSV = () => {
    exportToCSV(transactions);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imported = await importFromJSON(file);
      onImport(imported);
      alert('Data imported successfully!');
    } catch (error) {
      alert('Error importing file. Please check the file format.');
    }

    // Reset input
    e.target.value = '';
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      onClear();
    }
  };

  return (
    <motion.div
      className="data-controls"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <motion.button
        className="control-btn"
        onClick={handleExportJSON}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Download size={14} />
        Export JSON
      </motion.button>
      <motion.button
        className="control-btn"
        onClick={handleExportCSV}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FileText size={14} />
        Export CSV
      </motion.button>
      <motion.button
        className="control-btn"
        onClick={handleImportClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Upload size={14} />
        Import Data
      </motion.button>
      <motion.button
        className="control-btn danger"
        onClick={handleClear}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Trash size={14} />
        Clear All
      </motion.button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </motion.div>
  );
};

export default DataControls;
