import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Eye, Download, UserCheck, UserX } from 'lucide-react';
import { getAllUsers, suspendUser, activateUser, UserResponse } from '../../services/adminService';

const AdminUserManagement = () => {
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async (page = 1) => {
        try {
            setLoading(true);
            const response = await getAllUsers(page, pagination.limit);
            if (response.success) {
                setUsers(response.data.users);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSuspend = async (userId: string) => {
        if (confirm('Are you sure you want to suspend this user?')) {
            await suspendUser(userId);
            fetchUsers(pagination.page);
        }
    };

    const handleActivate = async (userId: string) => {
        await activateUser(userId);
        fetchUsers(pagination.page);
    };

    const filteredUsers = users.filter(user =>
        user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyles = (user: UserResponse) => {
        if (user.isSuspended) return 'bg-red-50 text-red-600';
        if (!user.isActive) return 'bg-gray-50 text-gray-500';
        if (user.isEmailVerified) return 'bg-green-50 text-green-600';
        return 'bg-yellow-50 text-yellow-600';
    };

    const getStatusLabel = (user: UserResponse) => {
        if (user.isSuspended) return 'Suspended';
        if (!user.isActive) return 'Inactive';
        if (user.isEmailVerified) return 'Verified';
        return 'Pending';
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">User Management</h1>
                    <p className="text-gray-500">Manage all platform users and their permissions.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all shadow-sm">
                    <Download size={18} className="text-gray-400" />
                    Export Users
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-w-full">
                <div className="p-4 border-b border-gray-100 flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search size={16} className="absolute inset-y-0 left-3 my-auto text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search user..."
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="p-2 border border-gray-100 rounded-lg hover:bg-gray-50">
                        <Filter size={16} className="text-gray-400" />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 uppercase text-[10px] font-black text-gray-400 tracking-wider">
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4 text-center">Type</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-sm">Loading users...</td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-sm">No users found.</td>
                                </tr>
                            ) : filteredUsers.map((user, i) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${i % 2 === 0 ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                                {user.fullname.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{user.fullname}</p>
                                                <p className="text-[10px] text-gray-400">ID: {user.id.slice(-6).toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-xs text-gray-600">{user.email}</p>
                                        <p className="text-[10px] text-gray-400">{user.phone}</p>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${user.role === 'OWNER' ? 'bg-primary/5 text-primary' : user.role === 'ADMIN' ? 'bg-gray-900 text-white' : 'bg-purple-50 text-purple-600'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-bold ${getStatusStyles(user)}`}>
                                            <div className={`w-1 h-1 rounded-full ${user.isSuspended ? 'bg-red-600' : 'bg-green-600'}`}></div>
                                            {getStatusLabel(user)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors" title="View Details">
                                                <Eye size={16} />
                                            </button>
                                            {user.isSuspended ? (
                                                <button
                                                    onClick={() => handleActivate(user.id)}
                                                    className="p-1.5 hover:bg-green-50 rounded-lg text-green-600 transition-colors"
                                                    title="Activate User"
                                                >
                                                    <UserCheck size={16} />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleSuspend(user.id)}
                                                    className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                                                    title="Suspend User"
                                                >
                                                    <UserX size={16} />
                                                </button>
                                            )}
                                            <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 bg-gray-50/50 flex items-center justify-between border-t border-gray-100">
                    <p className="text-xs text-gray-400">
                        Showing {users.length} of {pagination.total} users
                    </p>
                    <div className="flex gap-2">
                        <button
                            disabled={pagination.page <= 1}
                            onClick={() => fetchUsers(pagination.page - 1)}
                            className="px-3 py-1 text-xs font-bold border border-gray-200 rounded-lg text-gray-400 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        {[...Array(pagination.pages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => fetchUsers(i + 1)}
                                className={`w-8 h-8 flex items-center justify-center text-xs font-bold border rounded-lg ${pagination.page === i + 1 ? 'bg-primary text-white border-primary' : 'bg-white border-gray-200 text-gray-600'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            disabled={pagination.page >= pagination.pages}
                            onClick={() => fetchUsers(pagination.page + 1)}
                            className="px-3 py-1 text-xs font-bold border border-gray-200 bg-white rounded-lg text-gray-900 shadow-sm disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUserManagement;
