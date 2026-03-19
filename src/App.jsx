import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

// Componentes Globales
import { ToastContainer } from 'react-toastify';
import SidebarLayout from 'layouts/SidebarLayout';

// UIS AUTH & ERRORS
import ErrorPage404 from 'components/ErrorPage404';
import ErrorPage401 from 'components/ErrorPage401';
import Login from 'pages/auth/Login/Login';

// UI HOME
import Home from 'pages/home/Home';

//UI ANIO ACADEMICOS
import AgregarAnioAcademico from 'pages/anioacademico/Store';
import EditarAnioAcademico from 'pages/anioacademico/Update';
import ListarAniosAcademicos from 'pages/anioacademico/Index';

// UI PERIODOS
import AgregarPeriodo from 'pages/periodo/Store';
import EditarPeriodo from 'pages/periodo/Update';
import ListarPeriodos from 'pages/periodo/Index';

// UI CURSO
import AgregarCurso from 'pages/curso/Store';
import EditarCurso from 'pages/curso/Update';
import ListarCursos from 'pages/curso/Index';

//UI GRADOS
import AgregarGrado from 'pages/grado/Store';
import EditarGrado from 'pages/grado/Update';
import ListarGrados from 'pages/grado/Index';

//UI NIVEL
import AgregarNivel from 'pages/nivel/Store';
import EditarNivel from 'pages/nivel/Update';
import ListarNiveles from 'pages/nivel/Index';

//UI ALUMNO
import AgregarAlumno from 'pages/alumno/Store';
import EditarAlumno from 'pages/alumno/Update';
import ListarAlumnos from 'pages/alumno/Index';

//UI EMPLEADOS
import AgregarEmpleado from 'pages/empleado/Store';
import EditarEmpleado from 'pages/empleado/Update';
import ListarEmpleados from 'pages/empleado/Index';

//UI MALLA CURRICULAR
import AgregarMallaCurricular from 'pages/mallacurricular/Store';
import EditarMallaCurricular from 'pages/mallacurricular/Update';
import ListarMallasCurriculares from 'pages/mallacurricular/Index';

//UI SECCION
import AgregarSeccion from 'pages/seccion/Store';
import EditarSeccion from 'pages/seccion/Update';
import ListarSecciones from 'pages/seccion/Index';

//UI CONCEPTO PAGO
import AgregarConceptoPago from 'pages/conceptopago/Store';
import EditarConceptoPago from 'pages/conceptopago/Update';
import ListarConceptosPago from 'pages/conceptopago/Index';

//UI MATRICULA
import AgregarMatricula from 'pages/matricula/Store';
import EditarMatricula from 'pages/matricula/Update';
import ListarMatriculas from 'pages/matricula/Index';

//UI PAGO
import AgregarPago from 'pages/pago/Store';
import ListarPagos from 'pages/pago/Index';

//UI HORARIO
import AgregarHorario from 'pages/horario/Store';
import EditarHorario  from 'pages/horario/Update';
import ListarHorarios from 'pages/horario/Index';

// UI ASISTENCIA DIARIA
import ListarAsistenciasDiarias from 'pages/asistenciadiaria/Index';
import AgregarAsistenciaDiaria from 'pages/asistenciadiaria/Store';
import EditarAsistenciaDiaria from 'pages/asistenciadiaria/Update';

// UI PERFIL
import VerPerfil from 'pages/perfil/Index';
import EditarPerfil from 'pages/perfil/Update';



// Utilities
import ProtectedRouteHome from 'utilities/ProtectedRoutes/ProtectedRouteHome';
import ProtectedRoute from 'utilities/ProtectedRoutes/ProtectedRoute';
import { AuthProvider } from 'context/AuthContext';

function AppContent() {
  return (
    <Routes>
      {/* 1. LOGIN: Solo accesible si NO estás logueado */}
      <Route path="/" element={<ProtectedRouteHome element={<Login />} />} />

      {/* 2. LAYOUT GLOBAL: Envuelve todas las rutas privadas */}
      <Route
        element={
          <ProtectedRoute 
            element={<SidebarLayout />} 
            allowedRoles={['superadmin', 'admin', 'alumno', 'docente', 'cajero', 'portero']} 
          />
        }
      >
        <Route path="/home" element={<Home />} />

        {/* =======================================================
            MÓDULO: ANIO ACADEMICO
        ======================================================= */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin']} />}>
            <Route path="/anio-academico/agregar" element={<AgregarAnioAcademico />} />
            <Route path="/anio-academico/editar/:id" element={<EditarAnioAcademico />} />
            <Route path="/anio-academico/listar" element={<ListarAniosAcademicos />} />
        </Route>

        {/* =======================================================
            MÓDULO: PERIODOS
        ======================================================= */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin']} />}>
            <Route path="/periodo/agregar" element={<AgregarPeriodo />} />
            <Route path="/periodo/editar/:id" element={<EditarPeriodo />} />
            <Route path="/periodo/listar" element={<ListarPeriodos />} />
        </Route>

        {/* =======================================================
            MÓDULO: CURSOS
        ======================================================= */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin']} />}>
            <Route path="/curso/agregar" element={<AgregarCurso />} />
            <Route path="/curso/editar/:id" element={<EditarCurso />} />
            <Route path="/curso/listar" element={<ListarCursos />} />
        </Route>

        {/* =======================================================
            MÓDULO: NIVELES
        ======================================================= */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin']} />}>
            <Route path="/nivel/agregar" element={<AgregarNivel />} />
            <Route path="/nivel/editar/:id" element={<EditarNivel />} />
            <Route path="/nivel/listar" element={<ListarNiveles />} />
        </Route>

        {/* =======================================================
            MÓDULO: GRADOS
        ======================================================= */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin']} />}>
            <Route path="/grado/agregar" element={<AgregarGrado />} />
            <Route path="/grado/editar/:id" element={<EditarGrado />} />
            <Route path="/grado/listar" element={<ListarGrados />} />
        </Route>

        {/* =======================================================
            MÓDULO: ALUMNOS
        ======================================================= */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['admin', 'superadmin']} />}>
            <Route path="/alumno/agregar" element={<AgregarAlumno />} />
            <Route path="/alumno/editar/:id" element={<EditarAlumno />} />
            <Route path="/alumno/listar" element={<ListarAlumnos />} />
        </Route>

        {/* =======================================================
            MÓDULO: EMPLEADOS
        ======================================================= */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin']} />}>
            <Route path="/empleado/agregar" element={<AgregarEmpleado />} />
            <Route path="/empleado/editar/:id" element={<EditarEmpleado />} />
            <Route path="/empleado/listar" element={<ListarEmpleados />} />
        </Route>

        {/* =======================================================
            MÓDULO: MALLA CURRICULAR
        ======================================================= */}
        {/* Listar: accesible por varios / Agregar-Editar: solo superadmin */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin']} />}>
            <Route path="/malla-curricular/agregar" element={<AgregarMallaCurricular />} />
            <Route path="/malla-curricular/editar/:id" element={<EditarMallaCurricular />} />
        </Route>
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin', 'docente', 'alumno']} />}>
            <Route path="/malla-curricular/listar" element={<ListarMallasCurriculares />} />
        </Route>

        {/* =======================================================
            MÓDULO: SECCION
        ======================================================= */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin', 'admin']} />}>
            <Route path="/seccion/agregar" element={<AgregarSeccion />} />
            <Route path="/seccion/editar/:id" element={<EditarSeccion />} />
            <Route path="/seccion/listar" element={<ListarSecciones />} />
        </Route>

        {/* =======================================================
            MÓDULO: CONCEPTOS PAGO
        ======================================================= */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin', 'cajero']} />}>
            <Route path="/concepto-pago/listar" element={<ListarConceptosPago />} />
            <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin']} />}>
                <Route path="/concepto-pago/agregar" element={<AgregarConceptoPago />} />
                <Route path="/concepto-pago/editar/:id" element={<EditarConceptoPago />} />
            </Route>
        </Route>

        {/* =======================================================
            MÓDULO: MATRICULA
        ======================================================= */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['admin', 'superadmin']} />}>
            <Route path="/matricula/agregar" element={<AgregarMatricula />} />
            <Route path="/matricula/editar/:id" element={<EditarMatricula />} />
            <Route path="/matricula/listar" element={<ListarMatriculas />} />
        </Route>

        {/* =======================================================
            MÓDULO: HORARIO
        ======================================================= */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin', 'admin']} />}>
            <Route path="/horario/agregar" element={<AgregarHorario />} />
            <Route path="/horario/editar/:id" element={<EditarHorario />} />
        </Route>
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin', 'admin', 'docente', 'alumno']} />}>
            <Route path="/horario/listar" element={<ListarHorarios />} />
        </Route>

        {/* =======================================================
            MÓDULO: PAGO
        ======================================================= */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin', 'cajero']} />}>
            <Route path="/pago/agregar" element={<AgregarPago />} />
            <Route path="/pago/listar" element={<ListarPagos />} />
        </Route>

        {/* =======================================================
            MÓDULO: ASISTENCIA DIARIA (CORREGIDO)
        ======================================================= */}
        {/* Registro: Solo Portero (Escáner/Manual) */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['portero']} />}>
            <Route path="/asistencia/diaria/agregar" element={<AgregarAsistenciaDiaria />} />
        </Route>

        {/* Editar: Solo SuperAdmin */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin']} />}>
            <Route path="/asistencia/diaria/editar/:id" element={<EditarAsistenciaDiaria />} />
        </Route>

        {/* Listar: Portero y SuperAdmin */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['portero', 'superadmin']} />}>
            <Route path="/asistencia/diaria/listar" element={<ListarAsistenciasDiarias />} />
        </Route>

        {/* =======================================================
            MÓDULO: PERFIL
        ======================================================= */}
        {/* Todos los roles pueden ver y editar su propio perfil */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin', 'admin', 'alumno', 'docente', 'cajero', 'portero']} />}>
            <Route path="/perfil" element={<VerPerfil />} />
            <Route path="/perfil/editar" element={<EditarPerfil />} />
        </Route>

      </Route>

      {/* 3. ERRORES */}
      <Route path="/401" element={<ErrorPage401 />} />
      <Route path="*" element={<ErrorPage404 />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white text-primary">
          <AppContent />
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;