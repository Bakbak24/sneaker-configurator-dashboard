import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Order, OrderStatus } from '@/types/Order';

// Custom hook to check screen width
const useScreenWidth = () => {
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenWidth;
};

const DashboardPage: React.FC = () => {
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const screenWidth = useScreenWidth();
  const isMobile = screenWidth <= 440;

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const response = await fetch(
        'https://sneaker-configurator-backend.onrender.com/api/v1/orders',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const data = await response.json();
      if (data.status === 'success') {
        const ordersData = data.data.orders.map((order: {
          _id: string;
          customerName?: string;
          customerEmail?: string;
          createdAt: string;
          status: OrderStatus;
          laceColor?: { color: string; material: string };
          soleColor?: { color: string; material: string };
          tongueColor?: { color: string; material: string };
          tipColor?: { color: string; material: string };
        }) => ({
          id: order._id,
          customer: order.customerName || order.customerEmail,
          date: new Date(order.createdAt).toLocaleDateString(),
          status: order.status,
          laceColor: order.laceColor,
          soleColor: order.soleColor,
          tongueColor: order.tongueColor,
          tipColor: order.tipColor,
        }));
        setOrders(ordersData);
        setTotalOrders(ordersData.length);
      } else {
        console.error('Failed to fetch orders:', data.message);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // View Order Details
  const viewOrderDetails = (order: Order) => {
    setSelectedOrder({
      ...order,
      laceColor: order.laceColor || { color: '#ccc', material: 'none' },
      soleColor: order.soleColor || { color: '#ccc', material: 'none' },
      tongueColor: order.tongueColor || { color: '#ccc', material: 'none' },
      tipColor: order.tipColor || { color: '#ccc', material: 'none' },
    });
    setIsDialogOpen(true);
  };

  // Close Dialog
  const closeDialog = () => {
    setSelectedOrder(null);
    setIsDialogOpen(false);
  };

  // Delete Order
  const deleteOrder = async (id: string) => {
    try {
      const response = await fetch(
        `https://sneaker-configurator-backend.onrender.com/api/v1/orders/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.ok) {
        const updatedOrders = orders.filter((order) => order.id !== id);
        setOrders(updatedOrders);
        setTotalOrders(updatedOrders.length);
      } else {
        console.error('Failed to delete order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  // Update Order Status
  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    try {
      const response = await fetch(
        `https://sneaker-configurator-backend.onrender.com/api/v1/orders/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ status }),
        }
      );
      if (response.ok) {
        // Update status in orders list
        setOrders(orders.map(order => 
          order.id === id ? { ...order, status } : order
        ));
        // Update status in selected order if it's open
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder({ ...selectedOrder, status });
        }
        console.log('Order status updated successfully');
      } else {
        console.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Get status badge classes
  const getStatusBadgeClass = (status: OrderStatus) => {
    const baseClasses = "px-2 py-1 rounded text-sm font-bold";
    switch (status) {
      case 'shipped':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'in-production':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'canceled':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 bg-white">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Orders Overview</h1>

        <div className="mb-6">
          <p className="text-lg text-gray-600">
            Total Orders: <span className="font-bold text-black">{totalOrders}</span>
          </p>
        </div>

        {/* Conditional rendering based on screen width */}
        {!isMobile ? (
          /* Desktop Table */
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{order.customer}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <span className={getStatusBadgeClass(order.status)}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          onClick={() => viewOrderDetails(order)}
                          className="bg-black text-white hover:bg-white hover:text-black border border-black transition-all cursor-pointer text-xs sm:text-sm"
                          size="sm"
                        >
                          View Details
                        </Button>
                        <Button
                          onClick={() => deleteOrder(order.id)}
                          variant="destructive"
                          className="bg-red-600 hover:bg-red-700 cursor-pointer text-xs sm:text-sm"
                          size="sm"
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          /* Mobile Card Layout */
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">{order.customer}</h3>
                    <p className="text-gray-500 text-xs mt-1">{order.date}</p>
                  </div>
                  <span className={getStatusBadgeClass(order.status)}>
                    {order.status}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => viewOrderDetails(order)}
                    className="bg-black text-white hover:bg-white hover:text-black border border-black transition-all cursor-pointer text-xs w-full"
                    size="sm"
                  >
                    View Details
                  </Button>
                  <Button
                    onClick={() => deleteOrder(order.id)}
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700 cursor-pointer text-xs w-full"
                    size="sm"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg">Order Details</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm"><strong>Customer:</strong> {selectedOrder.customer}</p>
                  <p className="text-sm"><strong>Order Date:</strong> {selectedOrder.date}</p>
                  <p className="text-sm"><strong>Status:</strong> {selectedOrder.status}</p>
                </div>

                <div>
                  <h3 className="font-bold mb-3 text-sm">Customization Details:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start flex-col xs:flex-row xs:items-center gap-2">
                      <strong className="text-sm min-w-fit">Lace Color:</strong>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 border border-gray-300 inline-block flex-shrink-0"
                          style={{ backgroundColor: selectedOrder.laceColor?.color || '#ccc' }}
                        ></div>
                        <span className="text-sm">{selectedOrder.laceColor?.color || 'none'}</span>
                        <span className="text-xs text-gray-600">(Material: {selectedOrder.laceColor?.material || 'none'})</span>
                      </div>
                    </li>
                    <li className="flex items-start flex-col xs:flex-row xs:items-center gap-2">
                      <strong className="text-sm min-w-fit">Sole Color:</strong>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 border border-gray-300 inline-block flex-shrink-0"
                          style={{ backgroundColor: selectedOrder.soleColor?.color || '#ccc' }}
                        ></div>
                        <span className="text-sm">{selectedOrder.soleColor?.color || 'none'}</span>
                        <span className="text-xs text-gray-600">(Material: {selectedOrder.soleColor?.material || 'none'})</span>
                      </div>
                    </li>
                    <li className="flex items-start flex-col xs:flex-row xs:items-center gap-2">
                      <strong className="text-sm min-w-fit">Tongue Color:</strong>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 border border-gray-300 inline-block flex-shrink-0"
                          style={{ backgroundColor: selectedOrder.tongueColor?.color || '#ccc' }}
                        ></div>
                        <span className="text-sm">{selectedOrder.tongueColor?.color || 'none'}</span>
                        <span className="text-xs text-gray-600">(Material: {selectedOrder.tongueColor?.material || 'none'})</span>
                      </div>
                    </li>
                    <li className="flex items-start flex-col xs:flex-row xs:items-center gap-2">
                      <strong className="text-sm min-w-fit">Tip Color:</strong>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 border border-gray-300 inline-block flex-shrink-0"
                          style={{ backgroundColor: selectedOrder.tipColor?.color || '#ccc' }}
                        ></div>
                        <span className="text-sm">{selectedOrder.tipColor?.color || 'none'}</span>
                        <span className="text-xs text-gray-600">(Material: {selectedOrder.tipColor?.material || 'none'})</span>
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Update Status:</label>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(value: OrderStatus) => updateOrderStatus(selectedOrder.id, value)}
                  >
                    <SelectTrigger className="w-full text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-production">In Production</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="canceled">Canceled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={closeDialog} 
                  className="w-full mt-4 bg-black text-white hover:bg-gray-800 cursor-pointer text-sm"
                >
                  Close
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default DashboardPage;