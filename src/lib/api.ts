import {
  collection,
  getDocs,
  doc,
  getDoc,
  runTransaction,
  setDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";
import { Product, DeliveryWindow } from "./mockData";

// --- Delivery Configuration Interface ---
export interface DeliveryConfig {
<<<<<<< HEAD
  closedDaysOfWeek: number[];
  blackoutDates: string[];
  cutoffTime: number;
  timeSlots: string[];
=======
  closedDaysOfWeek: number[]; 
  blackoutDates: string[];    
  cutoffTime: number;
  deliveryWindows: string[]; // NEW: Dynamic time slots
>>>>>>> ff3d7d4 (Fix tiempos de entrega)
}

export const DEFAULT_DELIVERY_TIME_SLOTS = [
  "Mañana (8:00 AM - 12:00 PM)",
  "Tarde (1:00 PM - 5:00 PM)",
];

// --- Fetch Delivery Config from Firestore ---
export const fetchDeliveryConfig = async (): Promise<DeliveryConfig | null> => {
  try {
    const configRef = doc(db, "settings", "delivery");
    const docSnap = await getDoc(configRef);

    if (docSnap.exists()) {
<<<<<<< HEAD
      const data = docSnap.data() as Partial<DeliveryConfig>;
      return {
        closedDaysOfWeek: data.closedDaysOfWeek || [0],
        blackoutDates: data.blackoutDates || [],
        cutoffTime: data.cutoffTime ?? 17,
        timeSlots: data.timeSlots?.length ? data.timeSlots : DEFAULT_DELIVERY_TIME_SLOTS,
      };
    } else {
      console.warn("Delivery config document not found! Using defaults.");
      return {
          closedDaysOfWeek: [0],
          blackoutDates: [],
          cutoffTime: 17,
          timeSlots: DEFAULT_DELIVERY_TIME_SLOTS,
=======
      const data = docSnap.data();
      return {
        closedDaysOfWeek: data.closedDaysOfWeek || [0],
        blackoutDates: data.blackoutDates || [],
        cutoffTime: data.cutoffTime ?? 17,
        deliveryWindows: data.deliveryWindows || ["Mañana (8:00 AM - 12:00 PM)", "Tarde (1:00 PM - 5:00 PM)"]
      } as DeliveryConfig;
    } else {
      return {
          closedDaysOfWeek: [0],
          blackoutDates: [],
          cutoffTime: 17,
          deliveryWindows: ["Mañana (8:00 AM - 12:00 PM)", "Tarde (1:00 PM - 5:00 PM)"]
>>>>>>> ff3d7d4 (Fix tiempos de entrega)
      };
    }
  } catch (error) {
    console.error("Error fetching delivery config:", error);
    return null;
  }
};

// --- Fetch Featured Products ---
export const fetchFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const featRef = doc(db, "settings", "featured");
    const featSnap = await getDoc(featRef);
    if (!featSnap.exists()) return [];
    const featuredIds = featSnap.data().productIds as string[];
    if (!featuredIds || featuredIds.length === 0) return [];
    const allProducts = await fetchProducts();
    return featuredIds
      .map(id => allProducts.find(p => p.id === id))
      .filter((p): p is Product => p !== undefined);
<<<<<<< HEAD

=======
>>>>>>> ff3d7d4 (Fix tiempos de entrega)
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
};

// --- Generate Sequential Order Numbers ---
export const generateOrderNumber = async (): Promise<number> => {
  const counterRef = doc(db, "config", "order_counter");
<<<<<<< HEAD

  return await runTransaction(db, async (transaction) => {
    const counterDoc = await transaction.get(counterRef);

=======
  return await runTransaction(db, async (transaction) => {
    const counterDoc = await transaction.get(counterRef);
>>>>>>> ff3d7d4 (Fix tiempos de entrega)
    if (!counterDoc.exists()) {
      transaction.set(counterRef, { lastNumber: 1000 });
      return 1001;
    }
<<<<<<< HEAD

=======
>>>>>>> ff3d7d4 (Fix tiempos de entrega)
    const newNumber = counterDoc.data().lastNumber + 1;
    transaction.update(counterRef, { lastNumber: newNumber });
    return newNumber;
  });
};

// --- Create Order with Custom ID ---
export const createOrder = async (orderData: any) => {
  try {
    const orderNumber = await generateOrderNumber();
    const orderId = `ORD-${orderNumber}`;
<<<<<<< HEAD

=======
>>>>>>> ff3d7d4 (Fix tiempos de entrega)
    await setDoc(doc(db, "orders", orderId), {
      ...orderData,
      orderNumber,
      createdAt: serverTimestamp(),
      status: 'pending'
    });
<<<<<<< HEAD

=======
>>>>>>> ff3d7d4 (Fix tiempos de entrega)
    return { success: true, orderId };
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);
    const products: Product[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as Product;
      if (data.isActive) {
        products.push({ ...data, id: doc.id });
      }
    });
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const fetchActiveWindows = async (): Promise<DeliveryWindow[]> => {
  try {
    const windowsRef = collection(db, "deliveryWindows");
    const snapshot = await getDocs(windowsRef);
    const windows: DeliveryWindow[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as DeliveryWindow;
      if (data.isActive) {
        windows.push({ ...data, id: doc.id });
      }
    });
    return windows.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } catch (error) {
    console.error("Error fetching windows:", error);
    return [];
  }
};

export const fetchGlobalConfig = async () => {
  try {
    const configRef = doc(db, "config", "global_settings");
    const docSnap = await getDoc(configRef);
    if (docSnap.exists()) return docSnap.data();
    return null;
  } catch (error) {
    console.error("Error fetching config:", error);
    return null;
  }
};

export const fetchProductById = async (productId: string): Promise<Product | null> => {
  try {
    const productRef = doc(db, "products", productId);
    const docSnap = await getDoc(productRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as Product;
      return data.isActive ? { ...data, id: docSnap.id } : null;
    }
    return null;
  } catch (error) {
    console.error("Error fetching single product:", error);
    return null;
  }
};

export const fetchAllProductsAdmin = async (): Promise<Product[]> => {
  try {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);
    const products: Product[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as Product;
      products.push({ ...data, id: doc.id });
    });
    return products;
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
};
