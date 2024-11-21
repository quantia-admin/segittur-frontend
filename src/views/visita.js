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

function Visitas() {
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = useState([]);
  const [file, setFile] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;

  // Cargar los datos de la tabla `visita`
  const loadVisitas = () => {
    axios.get(`${API_URL}/visitas`)
      .then(response => {
        setRows(response.data);
        enqueueSnackbar('Visitas obtenidas correctamente', { variant: 'success' });
      })
      .catch(error => {
        console.error('Error al obtener los datos de visitas:', error);
        enqueueSnackbar('Error al obtener las visitas', { variant: 'error' });
      });
  };

  useEffect(() => {
    loadVisitas();
  }, []);

  // Función para descargar el Excel desde la carpeta pública
  const handleDownloadExcel = () => {
    const link = document.createElement('a');
    link.href = '/templates/visita_template.xlsx';
    link.setAttribute('download', 'visita_template.xlsx');
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
      const response = await axios.post(`${API_URL}/upload-excel?table=visita`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      enqueueSnackbar(response.data.message, { variant: 'success' });
      loadVisitas(); // Recargar los datos después de la subida
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      enqueueSnackbar('Error al subir el archivo', { variant: 'error' });
    }
  };

  // Función para eliminar una visita
  const handleDeleteRow = (id) => {
    axios.delete(`${API_URL}/visitas/${id}`)
      .then(() => {
        setRows(rows.filter(row => row.id !== id));
        enqueueSnackbar('Visita eliminada exitosamente', { variant: 'success' });
      })
      .catch(error => {
        console.error('Error al eliminar la visita:', error);
        enqueueSnackbar('Error al eliminar la visita', { variant: 'error' });
      });
  };

  // Columnas de la tabla `visita`
  const columns = [
    { field: 'id', headerName: 'ID', minWidth: 100, flex: 1 },
    { field: 'paciente_id', headerName: 'Paciente ID', minWidth: 150, flex: 1 },
    { field: 'centro_id', headerName: 'Centro ID', minWidth: 150, flex: 1 },
    { field: 'especialidad_id', headerName: 'Especialidad ID', minWidth: 150, flex: 1 },
    { field: 'servicio_id', headerName: 'Servicio ID', minWidth: 150, flex: 1 },
    { field: 'fecha_visita', headerName: 'Fecha Visita', minWidth: 150, flex: 1 },
    { field: 'intermediario_id', headerName: 'Intermediario ID', minWidth: 150, flex: 1 },
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
            <CardTitle tag="h4">Gestión de Visitas</CardTitle>
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
        style={{ position: 'fixed', bottom: 16, right: 16, backgroundColor: '#922220' }}
        onClick={() => document.getElementById('file-input').click()}
      >
        <AddIcon />
      </Fab>

      {/* Botón para subir el archivo Excel */}
      <Fab
        color="default"
        aria-label="upload"
        style={{ position: 'fixed', bottom: 80, right: 16, backgroundColor: '#007bff', color: '#fff' }}
        onClick={handleUploadExcel}
      >
        <UploadIcon />
      </Fab>

      {/* Botón para descargar el Excel */}
      <Fab
        color="default"
        aria-label="download"
        style={{ position: 'fixed', bottom: 144, right: 16, backgroundColor: '#43B97F', color: '#fff' }}
        onClick={handleDownloadExcel}
      >
        <DownloadIcon />
      </Fab>
    </>
  );
}

export default Visitas;
