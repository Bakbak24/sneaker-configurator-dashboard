import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Order, OrderStatus } from "@/types/Order";

const DashboardPage: React.FC = () => {
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "https://sneaker-configurator-backend.onrender.com/api/v1/orders",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        const ordersData = data.data.orders.map(
          (order: {
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
          })
        );
        setOrders(ordersData);
        setTotalOrders(ordersData.length);
      } else {
        console.error("Failed to fetch orders:", data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // View Order Details
  const viewOrderDetails = (order: Order) => {
    setSelectedOrder({
      ...order,
      laceColor: order.laceColor || { color: "#ccc", material: "none" },
      soleColor: order.soleColor || { color: "#ccc", material: "none" },
      tongueColor: order.tongueColor || { color: "#ccc", material: "none" },
      tipColor: order.tipColor || { color: "#ccc", material: "none" },
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
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        const updatedOrders = orders.filter((order) => order.id !== id);
        setOrders(updatedOrders);
        setTotalOrders(updatedOrders.length);
      } else {
        console.error("Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  // Update Order Status
  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    try {
      const response = await fetch(
        `https://sneaker-configurator-backend.onrender.com/api/v1/orders/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status }),
        }
      );
      if (response.ok) {
        // Update status in orders list
        setOrders(
          orders.map((order) =>
            order.id === id ? { ...order, status } : order
          )
        );
        // Update status in selected order if it's open
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder({ ...selectedOrder, status });
        }
        console.log("Order status updated successfully");
      } else {
        console.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // Get status badge classes
  const getStatusBadgeClass = (status: OrderStatus) => {
    const baseClasses = "px-2 py-1 rounded text-sm font-bold";
    switch (status) {
      case "shipped":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "in-production":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "canceled":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 bg-white">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Orders Overview
        </h1>

        <div className="mb-6">
          <p className="text-lg text-gray-600">
            Total Orders:{" "}
            <span className="font-bold text-black">{totalOrders}</span>
          </p>
        </div>

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
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <span className={getStatusBadgeClass(order.status)}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => viewOrderDetails(order)}
                        className="bg-black text-white hover:bg-white hover:text-black border border-black transition-all cursor-pointer"
                      >
                        View Details
                      </Button>
                      <Button
                        onClick={() => deleteOrder(order.id)}
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700 cursor-pointer"
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

        {/* Order Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div>
                  <p>
                    <strong>Customer:</strong> {selectedOrder.customer}
                  </p>
                  <p>
                    <strong>Order Date:</strong> {selectedOrder.date}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedOrder.status}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold mb-2">Customization Details:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <strong>Lace Color:</strong>
                      <div
                        className="w-5 h-5 mx-2 border border-gray-300 inline-block"
                        style={{
                          backgroundColor:
                            selectedOrder.laceColor?.color || "#ccc",
                        }}
                      ></div>
                      <span>{selectedOrder.laceColor?.color || "none"}</span>
                      <span className="ml-2">
                        (Material: {selectedOrder.laceColor?.material || "none"}
                        )
                      </span>
                    </li>
                    <li className="flex items-center">
                      <strong>Sole Color:</strong>
                      <div
                        className="w-5 h-5 mx-2 border border-gray-300 inline-block"
                        style={{
                          backgroundColor:
                            selectedOrder.soleColor?.color || "#ccc",
                        }}
                      ></div>
                      <span>{selectedOrder.soleColor?.color || "none"}</span>
                      <span className="ml-2">
                        (Material: {selectedOrder.soleColor?.material || "none"}
                        )
                      </span>
                    </li>
                    <li className="flex items-center">
                      <strong>Tongue Color:</strong>
                      <div
                        className="w-5 h-5 mx-2 border border-gray-300 inline-block"
                        style={{
                          backgroundColor:
                            selectedOrder.tongueColor?.color || "#ccc",
                        }}
                      ></div>
                      <span>{selectedOrder.tongueColor?.color || "none"}</span>
                      <span className="ml-2">
                        (Material:{" "}
                        {selectedOrder.tongueColor?.material || "none"})
                      </span>
                    </li>
                    <li className="flex items-center">
                      <strong>Tip Color:</strong>
                      <div
                        className="w-5 h-5 mx-2 border border-gray-300 inline-block"
                        style={{
                          backgroundColor:
                            selectedOrder.tipColor?.color || "#ccc",
                        }}
                      ></div>
                      <span>{selectedOrder.tipColor?.color || "none"}</span>
                      <span className="ml-2">
                        (Material: {selectedOrder.tipColor?.material || "none"})
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Update Status:
                  </label>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(value: OrderStatus) =>
                      updateOrderStatus(selectedOrder.id, value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-production">
                        In Production
                      </SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="canceled">Canceled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={closeDialog}
                  className="w-full mt-4 bg-black text-white hover:bg-gray-800 cursor-pointer"
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
