'use client';

import React, { useState } from 'react';
import AddOrderModal from '../../_components/OrderProductModal';
import { addOrders, updateOrders } from '../../../services/orderService';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { notifySuccess, notifyError } from '../../../utils/notify';

const MenuClient = ({ tables: initialTables }) => {
    const [tables, setTables] = useState(initialTables);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);


    const openModal = (table) => {
        setSelectedTable(table);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleOrderSubmit = async (tableId, orderItems) => {
        const orderData = { table_id: tableId, order_items: orderItems };

        let result
        if (selectedTable?.active_order) {
            result = await updateOrders(selectedTable.active_order.id, orderData);
            if (result.success) {
                notifySuccess('Sipariş başarıyla güncellendi!');
            } else {
                notifyError('Sipariş Güncellenemedi!');
            }
        } else {
            result = await addOrders(orderData);
            if (result.success) {
                notifySuccess('Sipariş başarıyla oluşturuldu!');
            } else {
                notifyError('Sipariş Oluşturulamadı!');
            }
        }
    
        if (result.success && result.data) {
            updateTableStatus(result.data); // Yeni tablo durumunu güncelle
        }
    
        closeModal();
        return result;
    };
    const handleRemoveOrderItems = (orderItemId) => {
        setTables((prevTables) =>
            prevTables.map((table) =>
                table.active_order
                    ? {
                        ...table,
                        active_order: {
                            ...table.active_order,
                            order_items: table.active_order.order_items.filter(
                                (item) => item.id !== orderItemId
                            ),
                        },
                    }
                    : table // Eğer active_order yoksa tabloyu aynen döndür
            )
        );
    };
    // Tablo durumunu güncelleyen fonksiyon
    const updateTableStatus = (updatedTable) => {
        setTables((prevTables) =>
            prevTables.map((table) =>
                table.id === updatedTable.id
                    ? { ...table, status: updatedTable.status, active_order: updatedTable.active_order }
                    : table
            )
        );
    };

    const getBackgroundColor = (status) => {
        if (status === 'available') {
            return 'bg-sky-900'; // success
        } else if (status === 'occupied') {
            return 'bg-orange-400'; // warning
        } else {
            return 'bg-gray-200'; // default background color
        }
    };

    return (
        <div>
            <div className="flex flex-wrap justify-around gap-4">
                {tables && tables.length > 0 ? (
                    tables.map((table) => (
                        <div key={table.id} className={`${getBackgroundColor(table.status)} w-64 h-64 border border-gray-200 rounded-lg shadow`} onClick={() => openModal(table)}>
                            <div className="p-6 text-center">
                                <h5 className="text-3xl font-semibold tracking-tight text-white">
                                    Masa <br /> {table.name}
                                </h5>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Veri bulunamadı.</p>
                )}
            </div>
            {/* ToastContainer */}
            <ToastContainer />
            <AddOrderModal
                isOpen={isModalOpen}
                onClose={closeModal}
                tableId={selectedTable?.id}
                activeOrder={selectedTable?.active_order}  // Aktif sipariş bilgisi gönderiliyor
                onOrderSubmit={handleOrderSubmit}
                removeOrderItemsMenuClient={handleRemoveOrderItems}
            />
        </div>
    );
};

export default MenuClient;
