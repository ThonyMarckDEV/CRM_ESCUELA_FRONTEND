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


// Utilities
import ProtectedRouteHome from 'utilities/ProtectedRoutes/ProtectedRouteHome';
import ProtectedRoute from 'utilities/ProtectedRoutes/ProtectedRoute';
import { AuthProvider } from 'context/AuthContext';

function AppContent() {
  return (
    <Routes>
      {/* 1. LOGIN */}
      <Route path="/" element={<ProtectedRouteHome element={<Login />} />} />

      {/* 2. LAYOUT GLOBAL */}
      <Route
        element={
          <ProtectedRoute 
            element={<SidebarLayout />} 
            allowedRoles={['superadmin', 'admin', 'usuario' , 'docente' , 'cajero' ]} 
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

        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={[ 'superadmin']} />}>
            <Route path="/periodo/agregar" element={<AgregarPeriodo />}  />
            <Route path="/periodo/editar/:id" element={<EditarPeriodo />} />
            <Route path="/periodo/listar" element={<ListarPeriodos />}  />
        </Route>

        {/* =======================================================
            MÓDULO: CURSOS
           ======================================================= */}

        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin']} />}>
            <Route path="/curso/agregar" element={<AgregarCurso />} />
            <Route path="/curso/editar/:id" element={<EditarCurso />} />
            <Route path="/curso/listar" element={<ListarCursos />}/>
        </Route>

        {/* =======================================================
            MÓDULO: NIVELES
           ======================================================= */}

        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin']} />}>
            <Route path="/nivel/agregar" element={<AgregarNivel />} />
            <Route path="/nivel/editar/:id" element={<EditarNivel />} />
            <Route path="/nivel/listar" element={<ListarNiveles />} allowedRoles={['docente']} />
        </Route>

        {/* =======================================================
            MÓDULO: GRADOS
           ======================================================= */}

        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin']} />}>
            <Route path="/grado/agregar" element={<AgregarGrado />} />
            <Route path="/grado/editar/:id" element={<EditarGrado />} />
            <Route path="/grado/listar" element={<ListarGrados />} allowedRoles={['superadmin' , 'docente']}  />
        </Route>

        {/* =======================================================
            MÓDULO: ALUMNOS
           ======================================================= */}

        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['admin']} />}>
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

        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin']} />}>
            <Route path="/malla-curricular/agregar" element={<AgregarMallaCurricular />} />
            <Route path="/malla-curricular/editar/:id" element={<EditarMallaCurricular />} />
            <Route path="/malla-curricular/listar" element={<ListarMallasCurriculares />} allowedRoles={['superadmin' , 'docente']} />
        </Route>


        {/* =======================================================
            MÓDULO: SECCION
           ======================================================= */}

        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin' , 'admin']} />}>
            <Route path="/seccion/agregar" element={<AgregarSeccion />} />
            <Route path="/seccion/editar/:id" element={<EditarSeccion />} />
            <Route path="/seccion/listar" element={<ListarSecciones />} />
        </Route>

        {/* =======================================================
            MÓDULO: CONCEPTOS PAGO
           ======================================================= */}

        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin']} />}>
            <Route path="/concepto-pago/agregar" element={<AgregarConceptoPago />} />
            <Route path="/concepto-pago/editar/:id" element={<EditarConceptoPago />} />
            <Route path="/concepto-pago/listar" element={<ListarConceptosPago />} allowedRoles={['superadmin' , 'cajero']} />
        </Route>

        {/* =======================================================
            MÓDULO: MATRICULA
           ======================================================= */}

        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['admin']} />}>
            <Route path="/matricula/agregar" element={<AgregarMatricula />} />
            <Route path="/matricula/editar/:id" element={<EditarMatricula />} />
            <Route path="/matricula/listar" element={<ListarMatriculas />} />
        </Route>

        {/* =======================================================
            MÓDULO: PAGO
           ======================================================= */}

        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin' , 'cajero']} />}>
            <Route path="/pago/agregar" element={<AgregarPago />} />
            <Route path="/pago/listar" element={<ListarPagos />}  />
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