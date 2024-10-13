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

    const handleOrderSubmit = async (tableId, products) => {
        const orderItems = products.map((product) => ({
            product_id: product.product_id,
            quantity: product.quantity,
            price: product.price,
        }));

        const orderData = { table_id: tableId, order_items: orderItems };

        let result;
        try {
            if (selectedTable.active_order) {
                // Eğer aktif sipariş varsa, güncelleme işlemi
                result = await updateOrders(selectedTable.active_order.id, orderData);
                console.log('Sipariş güncellendi:', result);
                if (result.success) {
                    notifySuccess('Sipariş başarıyla güncellendi!');
                } else {
                    notifyError('Sipariş Güncellenemedi!');
                }
            } else {
                // Yeni sipariş ekleme
                result = await addOrders(orderData);
                console.log('Yeni sipariş oluşturuldu:', result);
                if (result.success) {
                    notifySuccess('Sipariş başarıyla oluşturuldu!');
                } else {
                    notifyError('Sipariş Oluşturulamadı!');
                }
            }

            // Sipariş başarılıysa tabloyu güncelle
            if (result.success && result.data) {
                updateTableStatus(result.data);
            }
        } catch (error) {
            console.error('Sipariş işlemi sırasında hata:', error);
        }
        finally{
            closeModal();
            return result;
        }

        
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
            />
        </div>
    );
};

export default MenuClient;
