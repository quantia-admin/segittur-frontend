import React, { useState, useEffect } from "react";
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Fab, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';
import { useSnackbar } from 'notistack';
import { Card, CardHeader, CardBody, CardTitle } from "reactstrap";

function Servicios() {
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = useState([]);
  const [file, setFile] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;

  // Cargar los datos de la tabla `servicio`
  const loadServicios = () => {
    axios.get(`${API_URL}/servicios`)
      .then(response => {
        setRows(response.data);
        enqueueSnackbar('Servicios obtenidos correctamente', { variant: 'success' });
      })
      .catch(error => {
        console.error('Error al obtener los datos de servicios:', error);
        enqueueSnackbar('Error al obtener los servicios', { variant: 'error' });
      });
  };

  useEffect(() => {
    loadServicios();
  }, []);

  // Función para descargar el Excel desde la carpeta pública
  const handleDownloadExcel = () => {
    const link = document.createElement('a');
    link.href = '/templates/servicio_template.xlsx';
    link.setAttribute('download', 'servicio_template.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Función para manejar la selección de archivo
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      enqueueSnackbar(`Archivo seleccionado: ${selectedFile.name}`, { variant: 'info' });
    }
  };

  // Función para subir el archivo Excel al backend
  const handleUploadExcel = async () => {
    if (!file) {
      enqueueSnackbar('Por favor, selecciona un archivo Excel', { variant: 'warning' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/upload-excel?table=servicio`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        enqueueSnackbar(response.data.message, { variant: 'success' });
        loadServicios(); // Recargar los datos después de la subida
      }
    } catch (error) {
      console.error('Error al subir el archivo:', error);

      if (error.response) {
        enqueueSnackbar(error.response.data?.message || 'Error desconocido.', {
          variant: 'error',
        });
      } else if (error.request) {
        enqueueSnackbar('No se pudo conectar con el servidor. Por favor, intenta más tarde.', {
          variant: 'error',
        });
      } else {
        enqueueSnackbar(`Error en la solicitud: ${error.message}`, { variant: 'error' });
      }
    }
  };

  // Función para eliminar un servicio
  const handleDeleteRow = (id) => {
    axios.delete(`${API_URL}/servicios/${id}`)
      .then(() => {
        setRows(rows.filter(row => row.id !== id));
        enqueueSnackbar('Servicio eliminado exitosamente', { variant: 'success' });
      })
      .catch(error => {
        console.error('Error al eliminar el servicio:', error);
        enqueueSnackbar('Error al eliminar el servicio', { variant: 'error' });
      });
  };

  // Definir las columnas para la tabla `servicio`
  const columns = [
    { field: 'id', headerName: 'ID', minWidth: 100, flex: 1 },
    { field: 'nombre', headerName: 'Nombre', minWidth: 200, flex: 1 },
    { field: 'descripcion', headerName: 'Descripción', minWidth: 300, flex: 1 },
    { field: 'especialidad_id', headerName: 'Especialidad ID', minWidth: 150, flex: 1 },
    {
      field: 'actions',
      headerName: '',
      minWidth: 50,
      renderCell: (params) => (
        <IconButton
          color="#922220"
          size="small"
          onClick={() => handleDeleteRow(params.id)}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <div className="content">
        <Card>
          <CardHeader>
            <CardTitle tag="h4">Gestión de Servicios</CardTitle>
          </CardHeader>
          <CardBody>
            <div style={{ height: 900, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                editMode="row"
                pageSize={5}
                disableColumnMenu
                disableSelectionOnClick
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-cell': {
                    borderBottom: 'none',
                    fontFamily: 'Montserrat, sans-serif',
                    color: '#333',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f5f5f5',
                    color: '#922220',
                    fontSize: '14px',
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 'bold',
                    lineHeight: '1.25',
                    textTransform: 'uppercase',
                  },
                }}
              />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Input oculto para seleccionar el archivo Excel */}
      <input
        type="file"
        accept=".xlsx"
        id="file-input"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Botón para seleccionar el archivo Excel */}
      <Fab
        color="secondary"
        aria-label="add"
        onClick={() => document.getElementById('file-input').click()}
        style={{ position: 'fixed', bottom: 16, right: 16, backgroundColor: '#922220' }}
      >
        <AddIcon />
      </Fab>

      {/* Botón para subir el archivo Excel */}
      <Fab
        color="default"
        aria-label="upload"
        onClick={handleUploadExcel}
        style={{ position: 'fixed', bottom: 80, right: 16, backgroundColor: '#007bff', color: '#fff' }}
      >
        <UploadIcon />
      </Fab>

      {/* Botón para descargar el Excel */}
      <Fab
        color="default"
        aria-label="download"
        onClick={handleDownloadExcel}
        style={{ position: 'fixed', bottom: 144, right: 16, backgroundColor: '#43B97F', color: '#fff' }}
      >
        <DownloadIcon />
      </Fab>
    </>
  );
}

export default Servicios;
