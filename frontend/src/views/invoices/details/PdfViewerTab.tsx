// src/views/invoices/details/PdfViewerTab.tsx
import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import type Invoice from '@interfaces/invoice';
import { Viewer, type LoadError, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface PdfViewerTabProps {
  invoice: Invoice | null;
}

// Gestion des erreurs
const RenderError = ({ error }: { error: LoadError }) => {
  let message = '';
  switch (error.name) {
    case 'InvalidPDFException':
      message = 'Le fichier PDF est invalide';
      break;
    case 'MissingPDFException':
      message = 'Le fichier PDF est manquant';
      break;
    case 'UnexpectedResponseException':
      message = 'Erreur inattendue lors du chargement du PDF';
      break;
    default:
      message = 'Erreur inconnue lors du chargement du PDF';
      break;
  }

  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
      }}>
      <div
        style={{
          backgroundColor: '#e53e3e',
          borderRadius: '0.25rem',
          color: '#fff',
          padding: '0.5rem',
        }}>
        {message}
      </div>
    </div>
  );
};

const PdfViewerTab: React.FC<PdfViewerTabProps> = ({ invoice }) => {
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Plugin pour la barre d’outils
  const layoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: () => [], // Pas de sidebar
  });

  useEffect(() => {
    const fetchPdf = async () => {
      if (!invoice?.id) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:3000/invoices/${invoice.id}/pdf`, {
          method: 'GET',
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erreur lors de la récupération du PDF');
        }
        const arrayBuffer = await response.arrayBuffer();
        setPdfData(new Uint8Array(arrayBuffer));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Impossible de charger le PDF');
      } finally {
        setLoading(false);
      }
    };

    fetchPdf();
  }, [invoice?.id]);

  if (loading) {
    return <Spin tip="Chargement du PDF..." style={{ margin: '20px auto', display: 'block' }} />;
  }

  if (error) {
    return (
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          color: '#e53e3e',
        }}>
        {error}
      </div>
    );
  }

  if (!pdfData) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Aucun PDF disponible pour cette facture</div>;
  }

  return (
    <div style={{ height: 'calc(100vh - 300px)', width: '100%' }}>
      <Viewer
        fileUrl={pdfData}
        renderError={RenderError}
        defaultScale={SpecialZoomLevel.PageFit} // Affiche la page entière en hauteur
        plugins={[layoutPluginInstance]} // Barre d’outils pour zoom et navigation
        initialPage={0}
      />
    </div>
  );
};

export default PdfViewerTab;
