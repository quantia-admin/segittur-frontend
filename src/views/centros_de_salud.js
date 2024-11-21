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

function CentrosSalud() {
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = useState([]);
  const [file, setFile] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;

  // Cargar los datos de la tabla `centro`
  const loadCentrosDeSalud = () => {
    axios.get(`${API_URL}/centros_de_salud`)
      .then(response => {
        setRows(response.data);
        enqueueSnackbar('Centros de salud obtenidos correctamente', { variant: 'success' });
      })
      .catch(error => {
        console.error('Error al obtener los datos de centros de salud:', error);
        enqueueSnackbar('Error al obtener los centros de salud', { variant: 'error' });
      });
  };

  useEffect(() => {
    loadCentrosDeSalud();
  }, []);

  // Función para descargar el Excel desde la carpeta pública
  const handleDownloadExcel = () => {
    const link = document.createElement('a');
    link.href = '/templates/centro_template.xlsx';
    link.setAttribute('download', 'centro_template.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Función para manejar la selección de archivo
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    enqueueSnackbar(`Archivo seleccionado: ${selectedFile.name}`, { variant: 'info' });
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
      const response = await axios.post(`${API_URL}/upload-excel?table=centro`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response)
      // Manejar casos de éxito
      if (response.status === 200) {
        enqueueSnackbar(response.data.message || 'Archivo subido con éxito', { variant: 'success' });
        loadCentrosDeSalud(); // Recargar los datos después de la subida
      } else {
        // Manejar posibles errores aunque no sean lanzados como excepción
        enqueueSnackbar(
          response.data.message || 'Algo salió mal al subir el archivo',
          { variant: 'warning' }
        );
      }
    } catch (error) {
      console.error('Error al subir el archivo:', error);
  
      // Manejo detallado del error
      if (error.response) {
        // El servidor responde con un código de error HTTP (4xx o 5xx)
        const errorMessage =
          error.response.data?.message || 'Error al procesar el archivo en el servidor.';
        enqueueSnackbar(`Error del servidor: ${errorMessage}`, { variant: 'error' });
      } else if (error.request) {
        // No hubo respuesta del servidor
        enqueueSnackbar('No se pudo conectar con el servidor. Por favor, intenta más tarde.', {
          variant: 'error',
        });
      } else {
        // Error en la configuración de la solicitud
        enqueueSnackbar(`Error en la solicitud: ${error.message}`, { variant: 'error' });
      }
    }
  };

  // Función para eliminar un centro de salud
  const handleDeleteRow = (id) => {
    axios.delete(`${API_URL}/centros_de_salud/${id}`)
      .then(() => {
        setRows(rows.filter(row => row.id !== id));
        enqueueSnackbar('Centro de salud eliminado exitosamente', { variant: 'success' });
      })
      .catch(error => {
        console.error('Error al eliminar el centro de salud:', error);
        enqueueSnackbar('Error al eliminar el centro de salud', { variant: 'error' });
      });
  };

  // Columnas de la tabla `centro`
  const columns = [
    { field: 'id', headerName: 'ID', minWidth: 100, flex: 1 },
    { field: 'nombre', headerName: 'Nombre', minWidth: 250, flex: 1 },
    { field: 'direccion', headerName: 'Dirección', minWidth: 250, flex: 1 },
    { field: 'ubicacion', headerName: 'Ubicación', minWidth: 200, flex: 1 },
    { field: 'telefono', headerName: 'Teléfono', minWidth: 150, flex: 1 },
    { field: 'email', headerName: 'Email', minWidth: 200, flex: 1 },
    { field: 'capacidad_pacientes', headerName: 'Capacidad', minWidth: 120, flex: 1 },
    { field: 'numero_empleados', headerName: 'Empleados', minWidth: 120, flex: 1 },
    { field: 'servicios_urgencias', headerName: 'Urgencias', minWidth: 150, flex: 1, type: 'boolean' },
    { field: 'pagina_web', headerName: 'Página Web', minWidth: 200, flex: 1 },
    { field: 'comentarios', headerName: 'Comentarios', minWidth: 300, flex: 1 },
    { field: 'estado_centro', headerName: 'Estado', minWidth: 150, flex: 1 },
    { field: 'tipo_propiedad', headerName: 'Propiedad', minWidth: 150, flex: 1 },
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
            <CardTitle tag="h4">Gestión de Centros de Salud</CardTitle>
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

      {/* Input para seleccionar el archivo Excel */}
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

export default CentrosSalud;
