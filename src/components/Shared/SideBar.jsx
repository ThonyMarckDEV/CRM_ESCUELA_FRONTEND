import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    Bars3Icon, 
    ChevronDownIcon, 
    ArrowRightOnRectangleIcon,
    HomeIcon,
    CalendarDaysIcon,
    CubeIcon,
    ListBulletIcon
} from '@heroicons/react/24/outline'; 
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import { BookIcon, CalendarArrowDown, GraduationCapIcon, Section, UserSquare2Icon } from 'lucide-react';
import { useAuth } from 'context/AuthContext';
import { FaCertificate, FaLevelUpAlt, FaMoneyBillWaveAlt, FaMoneyCheck, FaUserGraduate } from 'react-icons/fa';

// =======================================================================
// CONFIGURACIÓN MAESTRA DEL MENÚ
// Definimos todos los items posibles y quién puede verlos.
// =======================================================================
const MASTER_MENU = [
    {
        section: 'Dashboard',
        link: '/home',
        icon: HomeIcon,
        allowedRoles: ['superadmin', 'admin', 'alumno' , 'docente']
    },
    { 
        section: 'Años Academicos', 
        icon: CalendarDaysIcon,
        allowedRoles: ['superadmin'],
        subs: [
            { 
                name: 'Listar Años Academicos', 
                link: '/anio-academico/listar', 
            },
            { 
                name: 'Agregar Año Academico', 
                link: '/anio-academico/agregar', 
            },
        ],
    },
    { 
        section: 'Periodos', 
        icon: CalendarArrowDown,
        allowedRoles: ['superadmin'],
        subs: [
            { 
                name: 'Listar Periodos', 
                link: '/periodo/listar', 
            },
            { 
                name: 'Agregar Periodo', 
                link: '/periodo/agregar', 
            },
        ],
    },
    { 
        section: 'Concepto Pago', 
        icon: FaMoneyCheck,
        allowedRoles: ['superadmin'],
        subs: [
            { 
                name: 'Listar Conceptos pago', 
                link: '/concepto-pago/listar', 
                allowedRoles: ['superadmin', 'cajero']
            },
            { 
                name: 'Agregar Concepto Pago', 
                link: '/concepto-pago/agregar', 
            },
        ],
    },
    { 
        section: 'Cursos', 
        icon: BookIcon,
        allowedRoles: ['superadmin'],
        subs: [
            { 
                name: 'Listar Cursos', 
                link: '/curso/listar', 
                allowedRoles: ['superadmin', 'docente']
            },
            { 
                name: 'Agregar Curso', 
                link: '/curso/agregar', 
            },
        ],
    },
    { 
        section: 'Malla Curricular', 
        icon: ListBulletIcon,
        allowedRoles: ['superadmin'],
        subs: [
            { 
                name: 'Listar Mallas', 
                link: '/malla-curricular/listar', 
                allowedRoles: ['superadmin', 'docente']
            },
            { 
                name: 'Agregar Malla', 
                link: '/malla-curricular/agregar', 
            },
        ],
    },
    { 
        section: 'Niveles', 
        icon: FaLevelUpAlt,
        allowedRoles: ['superadmin'],
        subs: [
            { 
                name: 'Listar Niveles', 
                link: '/nivel/listar', 
            },
            { 
                name: 'Agregar Nivel', 
                link: '/nivel/agregar', 
            },
        ],
    },
    { 
        section: 'Grados', 
        icon: GraduationCapIcon,
        allowedRoles: ['superadmin'],
        subs: [
            { 
                name: 'Listar Grados', 
                link: '/grado/listar', 
            },
            { 
                name: 'Agregar Grado', 
                link: '/grado/agregar', 
            },
        ],
    },
    { 
        section: 'Seccion', 
        icon: Section,
        allowedRoles: ['superadmin' , 'admin'],
        subs: [
            { 
                name: 'Listar Secciones', 
                link: '/seccion/listar', 
            },
            { 
                name: 'Agregar Seccion', 
                link: '/seccion/agregar', 
            },
        ],
    },
    { 
        section: 'Matricula', 
        icon: FaCertificate,
        allowedRoles: ['admin'],
        subs: [
            { 
                name: 'Listar Matriculas', 
                link: '/matricula/listar', 
            },
            { 
                name: 'Agregar Matricula', 
                link: '/matricula/agregar', 
            },
        ],
    },
    { 
        section: 'Pago', 
        icon: FaMoneyBillWaveAlt,
        allowedRoles: ['superadmin' , 'cajero'],
        subs: [
            { 
                name: 'Listar Pagos', 
                link: '/pago/listar', 
            },
            { 
                name: 'Agregar Pago', 
                link: '/pago/agregar', 
            },
        ],
    },
    { 
        section: 'Alumnos', 
        icon: FaUserGraduate,
        allowedRoles: ['admin'],
        subs: [
            { 
                name: 'Listar Alumnos', 
                link: '/alumno/listar', 
            },
            { 
                name: 'Agregar Alumno', 
                link: '/alumno/agregar', 
            },
        ],
    },
    { 
        section: 'Empleados', 
        icon: UserSquare2Icon,
        allowedRoles: ['superadmin'],
        subs: [
            { 
                name: 'Listar Empleados', 
                link: '/empleado/listar', 
            },
            { 
                name: 'Agregar Empleado', 
                link: '/empleado/agregar', 
            },
        ],
    },
];

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [openSection, setOpenSection] = useState(null); 
    const [showConfirm, setShowConfirm] = useState(false);
    
    const location = useLocation();
    
    // Obtener Rol
    const { role: userRole, logout } = useAuth();

    const handleLogout = () => { logout(); setShowConfirm(false); };
    
    // =======================================================================
    // LÓGICA DE FILTRADO
    // Creamos el menú específico para el usuario actual dinámicamente
    // =======================================================================
    const userMenu = useMemo(() => {
        if (!userRole) return [];

        return MASTER_MENU.reduce((acc, item) => {
            // 1. Verificar si el rol tiene permiso para la SECCIÓN principal
            if (!item.allowedRoles.includes(userRole)) return acc;

            // 2. Si tiene submenús, filtramos también los hijos
            if (item.subs) {
                const visibleSubs = item.subs.filter(sub => 
                    // Si no tiene allowedRoles definido, asume que hereda del padre,
                    // si lo tiene, verifica que el usuario esté incluido.
                    !sub.allowedRoles || sub.allowedRoles.includes(userRole)
                );

                // Solo mostramos la sección si tiene al menos un submenú visible
                if (visibleSubs.length > 0) {
                    acc.push({ ...item, subs: visibleSubs });
                }
            } else {
                // Es un link directo (ej: Dashboard)
                acc.push(item);
            }

            return acc;
        }, []);
    }, [userRole]);

    const toggleSection = (section) => { 
        if (!isHovered && window.innerWidth >= 768) setIsHovered(true); 
        setOpenSection(prev => prev === section ? null : section); 
    };

    const handleMouseEnter = () => { if (window.innerWidth >= 768) setIsHovered(true); };
    const handleMouseLeave = () => { if (window.innerWidth >= 768) setIsHovered(false); };

    const isSectionActive = useCallback((item) => {
        if (item.subs) return item.subs.some(sub => location.pathname.startsWith(sub.link));
        if (item.link) return location.pathname === item.link; // Dashboard exacto
        return false;
    }, [location.pathname]);
    
    useEffect(() => {
        if (openSection === null) {
            const activeItem = userMenu.find(item => isSectionActive(item));
            if (activeItem && activeItem.subs) setOpenSection(activeItem.section);
        }
    }, [location.pathname, userMenu, isSectionActive, openSection]); 

    const sidebarWidth = isHovered ? 'md:w-72' : 'md:w-20';

    return (
        <>
            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* Botón Móvil */}
            <button className="md:hidden fixed top-4 left-4 z-50 p-2 bg-black text-white rounded-md shadow-lg" onClick={() => setIsOpen(!isOpen)}>
                <Bars3Icon className="h-6 w-6" />
            </button>

            {/* Sidebar Container */}
            <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 shadow-sm z-40 transition-all duration-300 ease-in-out flex flex-col
                    ${isOpen ? 'translate-x-0 w-72' : '-translate-x-full'} 
                    ${sidebarWidth} md:translate-x-0`}
            >
                {/* 1. HEADER */}
                <div className={`flex items-center justify-center flex-shrink-0 border-b border-gray-100 transition-all duration-300 ${isHovered ? 'h-24' : 'h-20'}`}>
                    <div className="bg-black text-white flex items-center justify-center font-bold rounded-lg w-10 h-10 text-xl transition-all duration-300">
                        S
                    </div>
                    <div className={`ml-3 font-bold text-lg tracking-tight overflow-hidden transition-all duration-300 whitespace-nowrap ${!isHovered ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                        SISTEMA<span className="text-gray-400">ADMIN</span>
                    </div>
                </div>

                {/* 2. BODY (Renderizando userMenu filtrado) */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 space-y-2 hide-scrollbar px-3">
                    {userMenu.map((item, index) => {
                        const isActive = isSectionActive(item); 
                        const isSubOpen = item.subs && openSection === item.section; 
                        const IconComponent = item.icon || CubeIcon;
                        
                        const itemBaseClasses = "flex items-center w-full p-3 rounded-lg transition-all duration-200 group relative";
                        const activeClasses = "bg-black text-white shadow-lg shadow-gray-200"; 
                        const inactiveClasses = "text-gray-600 hover:bg-gray-100 hover:text-black"; 
                        
                        return (
                            <div key={index}>
                                {item.subs ? (
                                    <>
                                        <button 
                                            onClick={() => toggleSection(item.section)} 
                                            className={`${itemBaseClasses} ${isActive && !isHovered ? 'bg-gray-100 text-black' : (isActive ? activeClasses : inactiveClasses)}`}
                                            title={!isHovered ? item.section : ''}
                                        >
                                            <IconComponent className="h-6 w-6 flex-shrink-0" /> 
                                            <span className={`ml-3 font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${!isHovered ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                                                {item.section}
                                            </span>
                                            {(isHovered || window.innerWidth < 768) && (
                                                <ChevronDownIcon className={`ml-auto h-4 w-4 transition-transform duration-300 ${isSubOpen ? 'rotate-180' : ''}`}/>
                                            )}
                                        </button>

                                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isSubOpen ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                                            {(isHovered || window.innerWidth < 768) && (
                                                <ul className="ml-4 pl-4 border-l border-gray-200 space-y-1">
                                                    {item.subs.map((sub, idx) => (
                                                        <li key={idx}>
                                                            <Link to={sub.link} onClick={() => setIsOpen(false)} 
                                                                className={`block py-2 px-3 rounded-md text-sm font-medium transition-colors
                                                                ${location.pathname.startsWith(sub.link) 
                                                                    ? 'text-black bg-gray-50' 
                                                                    : 'text-gray-500 hover:text-black hover:bg-gray-50'}`}>
                                                                {sub.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <Link to={item.link} onClick={() => setIsOpen(false)} 
                                        className={`${itemBaseClasses} ${isActive ? activeClasses : inactiveClasses}`}
                                        title={!isHovered ? item.section : ''}
                                    >
                                        <IconComponent className="h-6 w-6 flex-shrink-0" />
                                        <span className={`ml-3 font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${!isHovered ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                                            {item.section}
                                        </span>
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* 3. FOOTER */}
                <div className="p-4 border-t border-gray-100 flex-shrink-0">
                    <button onClick={() => setShowConfirm(true)} 
                        className={`flex items-center w-full p-3 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group ${!isHovered ? 'justify-center' : ''}`} 
                        title="Cerrar Sesión">
                        <ArrowRightOnRectangleIcon className="h-6 w-6 flex-shrink-0" />
                        <span className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 font-medium ${!isHovered ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                            Salir
                        </span>
                    </button>
                </div>
            </div>

            {showConfirm && (
                <ConfirmModal message="¿Deseas cerrar sesión del sistema?" onConfirm={handleLogout} onCancel={() => setShowConfirm(false)} />
            )}
        </>
    );
};

export default Sidebar;