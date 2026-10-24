'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  UserCheck,
  UserPlus,
  Shield,
  ShieldAlert,
  Building2,
  Mail,
  Phone,
  Calendar,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  KeyRound,
  UserCog,
} from 'lucide-react';
import {
  createUserAction,
  updateUserAction,
  toggleUserRoleAction,
  deleteUserAction,
} from '@/features/admin/userActions';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  role: 'USER' | 'ADMIN';
  created_at: string;
}

interface UsersTableClientProps {
  initialUsers: UserProfile[];
}

export function UsersTableClient({ initialUsers }: UsersTableClientProps) {
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'USER' | 'ADMIN'>('all');

  // Estados de feedback
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Estados de Modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);

  // Formulario Crear
  const [createForm, setCreateForm] = useState({
    full_name: '',
    email: '',
    company: '',
    phone: '',
    role: 'USER' as 'USER' | 'ADMIN',
    password: '',
  });

  // Formulario Editar
  const [editForm, setEditForm] = useState({
    full_name: '',
    company: '',
    phone: '',
    role: 'USER' as 'USER' | 'ADMIN',
  });

  const showFeedback = (text: string, type: 'success' | 'error') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 5000);
  };

  // Filtrado de usuarios
  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      u.full_name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.company?.toLowerCase().includes(term) ||
      u.phone?.toLowerCase().includes(term);
    return matchesRole && matchesSearch;
  });

  const adminCount = users.filter((u) => u.role === 'ADMIN').length;
  const clientCount = users.filter((u) => u.role === 'USER').length;

  // 1. Manejador: Crear Usuario
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.full_name.trim() || !createForm.email.trim()) {
      showFeedback('Nombre y correo electrónico son requeridos.', 'error');
      return;
    }

    setLoadingActionId('create');
    try {
      const res = await createUserAction(createForm);
      if (res.success) {
        showFeedback(res.message || 'Usuario creado exitosamente.', 'success');
        setIsCreateModalOpen(false);
        setCreateForm({
          full_name: '',
          email: '',
          company: '',
          phone: '',
          role: 'USER',
          password: '',
        });
        // Agregar optimistamente o recargar
        router.refresh();
      } else {
        showFeedback(res.error || 'Error al crear usuario.', 'error');
      }
    } catch {
      showFeedback('Error de comunicación con el servidor.', 'error');
    } finally {
      setLoadingActionId(null);
    }
  };

  // 2. Manejador: Abrir Edición
  const handleOpenEdit = (user: UserProfile) => {
    setEditingUser(user);
    setEditForm({
      full_name: user.full_name || '',
      company: user.company || '',
      phone: user.phone || '',
      role: user.role || 'USER',
    });
  };

  // 3. Manejador: Guardar Edición
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setLoadingActionId(`edit-${editingUser.id}`);
    try {
      const res = await updateUserAction(editingUser.id, editForm);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editingUser.id
              ? {
                  ...u,
                  full_name: editForm.full_name,
                  company: editForm.company,
                  phone: editForm.phone,
                  role: editForm.role,
                }
              : u
          )
        );
        showFeedback('Datos del usuario actualizados correctamente.', 'success');
        setEditingUser(null);
        router.refresh();
      } else {
        showFeedback(res.error || 'Error al actualizar el usuario.', 'error');
      }
    } catch {
      showFeedback('Error al guardar los cambios.', 'error');
    } finally {
      setLoadingActionId(null);
    }
  };

  // 4. Manejador: Cambiar Rol Rápido
  const handleToggleRole = async (user: UserProfile) => {
    const newRole: 'USER' | 'ADMIN' = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    setLoadingActionId(`role-${user.id}`);
    try {
      const res = await toggleUserRoleAction(user.id, newRole);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
        );
        showFeedback(`Rol de ${user.full_name} cambiado a ${newRole}.`, 'success');
        router.refresh();
      } else {
        showFeedback(res.error || 'No se pudo actualizar el rol.', 'error');
      }
    } catch {
      showFeedback('Error al actualizar el rol.', 'error');
    } finally {
      setLoadingActionId(null);
    }
  };

  // 5. Manejador: Eliminar Usuario
  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    setLoadingActionId(`delete-${userToDelete.id}`);
    try {
      const res = await deleteUserAction(userToDelete.id);
      if (res.success) {
        setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
        showFeedback(`Usuario ${userToDelete.full_name} eliminado del sistema.`, 'success');
        setUserToDelete(null);
        router.refresh();
      } else {
        showFeedback(res.error || 'Error al eliminar el usuario.', 'error');
      }
    } catch {
      showFeedback('Error al intentar eliminar el usuario.', 'error');
    } finally {
      setLoadingActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mensaje de Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between gap-3 shadow-xs animate-in fade-in duration-200 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-red-50 text-red-900 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="p-1 hover:bg-black/5 rounded-md transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Barra de Filtros, Búsqueda y Botón de Registro */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Pestañas de Rol */}
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              roleFilter === 'all'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Todos ({users.length})
          </button>
          <button
            onClick={() => setRoleFilter('USER')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              roleFilter === 'USER'
                ? 'bg-[#0284C7] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Clientes ({clientCount})
          </button>
          <button
            onClick={() => setRoleFilter('ADMIN')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              roleFilter === 'ADMIN'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Administradores ({adminCount})
          </button>
        </div>

        {/* Buscador y Botón Nuevo */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, correo, empresa..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden"
            />
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-[#0284C7] hover:bg-[#0284C7]/90 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" /> Registrar Usuario
          </button>
        </div>
      </div>

      {/* Tabla de Usuarios */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No se encontraron cuentas ni perfiles</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm || roleFilter !== 'all'
              ? 'No hay registros que coincidan con los criterios de búsqueda aplicados.'
              : 'Utilice el botón superior para registrar nuevos clientes o administradores.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-4">Usuario / Contacto</th>
                  <th className="p-4">Empresa / Razón Social</th>
                  <th className="p-4">Teléfono</th>
                  <th className="p-4 text-center">Rol en Plataforma</th>
                  <th className="p-4">Fecha Registro</th>
                  <th className="p-4 text-right">Acciones (CRUD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition">
                    {/* Usuario / Contacto */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-black text-sm shrink-0 border border-slate-200">
                          {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <span className="font-extrabold text-slate-900 block text-sm">
                            {user.full_name || 'Sin nombre asignado'}
                          </span>
                          <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" /> {user.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Empresa / Razón Social */}
                    <td className="p-4 font-semibold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                        <span>{user.company || 'Particular'}</span>
                      </div>
                    </td>

                    {/* Teléfono */}
                    <td className="p-4 text-slate-600">
                      {user.phone ? (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{user.phone}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No registrado</span>
                      )}
                    </td>

                    {/* Rol con Selector Rápido */}
                    <td className="p-4 text-center">
                      {loadingActionId === `role-${user.id}` ? (
                        <div className="inline-flex items-center gap-1 text-slate-400 text-[11px] font-semibold">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Guardando...
                        </div>
                      ) : (
                        <button
                          onClick={() => handleToggleRole(user)}
                          title="Haga clic para alternar entre CLIENTE y ADMIN"
                          className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1 rounded-lg border transition cursor-pointer ${
                            user.role === 'ADMIN'
                              ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                              : 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100'
                          }`}
                        >
                          <Shield className="w-3 h-3" />
                          <span>{user.role === 'ADMIN' ? 'ADMINISTRADOR' : 'CLIENTE'}</span>
                        </button>
                      )}
                    </td>

                    {/* Fecha de Registro */}
                    <td className="p-4 text-slate-500 font-medium">
                      <div className="flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {new Date(user.created_at).toLocaleDateString('es-CO', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(user)}
                          title="Editar información del cliente"
                          className="p-2 text-slate-500 hover:text-[#0284C7] hover:bg-slate-100 rounded-xl transition cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setUserToDelete(user)}
                          title="Eliminar usuario del sistema"
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 1: REGISTRAR NUEVO USUARIO / CLIENTE */}
      {/* ===================================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0284C7]/10 text-[#0284C7] flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Registrar Nuevo Usuario / Cliente</h3>
                  <p className="text-xs text-slate-500">Cree una cuenta para asignar a una empresa o como administrador.</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={createForm.full_name}
                  onChange={(e) => setCreateForm({ ...createForm, full_name: e.target.value })}
                  placeholder="Ej. Ing. Fernando Gómez"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  placeholder="compras@empresa.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Empresa / Razón Social</label>
                  <input
                    type="text"
                    value={createForm.company}
                    onChange={(e) => setCreateForm({ ...createForm, company: e.target.value })}
                    placeholder="Construcciones S.A.S."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Teléfono / Celular</label>
                  <input
                    type="text"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    placeholder="+57 300 000 0000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Rol en el Sistema *</label>
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden cursor-pointer"
                  >
                    <option value="USER">CLIENTE (Usuario normal)</option>
                    <option value="ADMIN">ADMINISTRADOR (Acceso completo)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contraseña Inicial</label>
                  <input
                    type="text"
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    placeholder="Por defecto: Suministros2026*"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loadingActionId === 'create'}
                  className="px-5 py-2.5 bg-[#0284C7] hover:bg-[#0284C7]/90 text-white font-extrabold rounded-xl shadow-xs transition flex items-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {loadingActionId === 'create' ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Guardando...
                    </>
                  ) : (
                    'Guardar Usuario'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: EDITAR USUARIO / CAMBIAR ROL */}
      {/* ===================================================================== */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-[#0F172A] flex items-center justify-center font-bold">
                  <UserCog className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Editar Usuario y Rol</h3>
                  <p className="text-xs text-slate-500 font-mono">{editingUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Empresa / Entidad</label>
                  <input
                    type="text"
                    value={editForm.company}
                    onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Rol en la Plataforma *</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden cursor-pointer"
                >
                  <option value="USER">CLIENTE (Acceso al catálogo y a su propio historial)</option>
                  <option value="ADMIN">ADMINISTRADOR (Acceso total al panel de control)</option>
                </select>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Cambiar el rol otorga o revoca inmediatamente los permisos en el panel privado de administración.
                </span>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2.5 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loadingActionId === `edit-${editingUser.id}`}
                  className="px-5 py-2.5 bg-[#0F172A] hover:bg-[#0284C7] text-white font-extrabold rounded-xl shadow-xs transition flex items-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {loadingActionId === `edit-${editingUser.id}` ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Guardando...
                    </>
                  ) : (
                    'Guardar Cambios'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 3: CONFIRMAR ELIMINACIÓN DE USUARIO */}
      {/* ===================================================================== */}
      {userToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 text-center">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900">¿Eliminar este usuario?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Está a punto de eliminar la cuenta de{' '}
                <strong className="text-slate-900">{userToDelete.full_name}</strong> ({userToDelete.email}). Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="flex gap-2 pt-2 justify-center">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2.5 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={loadingActionId === `delete-${userToDelete.id}`}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {loadingActionId === `delete-${userToDelete.id}` ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Eliminando...
                  </>
                ) : (
                  'Sí, Eliminar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
