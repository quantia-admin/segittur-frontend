import CentrosSalud from "views/centros_de_salud";
import Servicios from "views/servicios";
import Especialidades from "views/especialidades";
import IndicadoresMedioambientales from "views/indicadores_medioam";
import Pacientes from "views/pacientes";
import Costos from "views/costos";
import Visitas from "views/visita";

var routes = [
  {
    path: "/centros-salud",
    name: "Centros de Salud",
    icon: "nc-icon nc-ambulance",
    component: <CentrosSalud />,
    layout: "/admin",
  },
  {
    path: "/costos",
    name: "Costos",
    icon: "nc-icon nc-money-coins", 
    component: <Costos />,
    layout: "/admin",
  },
  {
    path: "/servicios",
    name: "Servicios",
    icon: "nc-icon nc-tile-56", 
    component: <Servicios />,
    layout: "/admin",
  },
  {
    path: "/indicadores-medioambientales",
    name: "Ind. Medioambientales",
    icon: "nc-icon nc-world-2",
    component: <IndicadoresMedioambientales />,
    layout: "/admin",
  },
  {
    path: "/especialidades",
    name: "Especialidades",
    icon: "nc-icon nc-badge", 
    component: <Especialidades />,
    layout: "/admin",
  },
  {
    path: "/pacientes",
    name: "Pacientes",
    icon: "nc-icon nc-single-02", 
    component: <Pacientes />,
    layout: "/admin",
  },
  {
    path: "/visitas",
    name: "Visitas",
    icon: "nc-icon nc-calendar-60",
    component: <Visitas />,
    layout: "/admin",
  }
];

export default routes;
