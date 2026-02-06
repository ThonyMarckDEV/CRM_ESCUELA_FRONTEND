import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

// Componentes Globales
import { ToastContainer } from 'react-toastify';
import SidebarLayout from 'layouts/SidebarLayout';

// UIS AUTH & ERRORS
import ErrorPage404 from 'components/ErrorPage404';
import ErrorPage401 from 'components/ErrorPage401';
import Login from 'ui/auth/Login/Login';

// UI HOME
import Home from 'ui/home/Home';

//UI ANIO ACADEMICOS
import AgregarAnioAcademico from 'ui/anioacademico/store/AgregarAnioAcademico';
import EditarAnioAcademico from 'ui/anioacademico/update/EditarAnioAcademico';
import ListarAniosAcademicos from 'ui/anioacademico/index/ListarAniosAcademicos';

// UI PERIODOS
import AgregarPeriodo from 'ui/periodo/store/AgregarPeriodo';
import EditarPeriodo from 'ui/periodo/update/EditarPeriodo';
import ListarPeriodos from 'ui/periodo/index/ListarPeriodos';

// UI CURSO
import AgregarCurso from 'ui/curso/store/AgregarCurso';
import EditarCurso from 'ui/curso/update/EditarCurso';
import ListarCursos from 'ui/curso/index/ListarCursos';

//UI GRADOS
import AgregarGrado from 'ui/grado/store/AgregarGrado';
import EditarGrado from 'ui/grado/update/EditarGrado';
import ListarGrados from 'ui/grado/index/ListarGrados';

//UI NIVEL
import AgregarNivel from 'ui/nivel/store/AgregarNivel';
import EditarNivel from 'ui/nivel/update/EditarNivel';
import ListarNiveles from 'ui/nivel/index/ListarNiveles';

//UI ALUMNO
import AgregarAlumno from 'ui/alumno/store/AgregarAlumno';
import EditarAlumno from 'ui/alumno/update/EditarAlumno';
import ListarAlumnos from 'ui/alumno/index/ListarAlumnos';

//UI EMPLEADOS
import AgregarEmpleado from 'ui/empleado/store/AgregarEmpleado';
import EditarEmpleado from 'ui/empleado/update/EditarEmpleado';
import ListarEmpleados from 'ui/empleado/index/ListarEmpleados';

//UI MALLA CURRICULAR
import AgregarMallaCurricular from 'ui/mallacurricular/store/AgregarMallaCurricular';
import EditarMallaCurricular from 'ui/mallacurricular/update/EditarMallaCurricular';
import ListarMallasCurriculares from 'ui/mallacurricular/index/ListarMallaCurricular';

//UI SECCION
import AgregarSeccion from 'ui/seccion/store/AgregarSeccion';
import EditarSeccion from 'ui/seccion/update/EditarSeccion';
import ListarSecciones from 'ui/seccion/index/ListarSecciones';

//UI CONCEPTO PAGO
import AgregarConceptoPago from 'ui/conceptopago/store/AgregarConceptoPago';
import EditarConceptoPago from 'ui/conceptopago/update/EditarConceptoPago';
import ListarConceptosPago from 'ui/conceptopago/index/ListarConceptosPago';

//UI MATRICULA
import AgregarMatricula from 'ui/matricula/store/AgregarMatricula';
import EditarMatricula from 'ui/matricula/update/EditarMatricula';
import ListarMatriculas from 'ui/matricula/index/ListarMatriculas';

//UI PAGO
import AgregarPago from 'ui/pago/store/AgregarPago';
import ListarPagos from 'ui/pago/index/ListarPagos';


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