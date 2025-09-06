import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'operator' | 'admin';
  operatorName?: string;
  membershipType?: 'basic' | 'standard' | 'premium';
  membershipExpiryDate?: string;
  hasMembership?: boolean;
  bookingCount?: number;
  bookingLimit?: number;
  cancellationCount?: number;
  cancellationLimit?: number;
  operatorCancellationCount?: number;
  operatorCancellationLimit?: number;
  profileCompletionStatus?: 'incomplete' | 'pending' | 'approved' | 'rejected';
  hasUploadedID?: boolean;
  isApprovedByAdmin?: boolean;
  hasUploadedAOC?: boolean;
  operatorId?: string;
  customerId?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  memberSince?: string;
  operatorDeletionCount?: number;
  discountUsage?: {
    [operatorName: string]: number;
  };
  operatorDiscountUsage?: {
    [operatorName: string]: number;
  };
  totalDiscountsUsed?: number;
}

interface BookingRequest {
  id: string;
  bookingNumber: string;
  type: 'flight_request' | 'route_booking';
  customer: string;
  email: string;
  from: string;
  to: string;
  departure: string;
  return: string;
  passengers: number;
  tripType: 'oneWay' | 'roundTrip';
  specialRequests: string;
  status: string;
  requestDate: string;
  createdAt: string;
  offers: any[];
  rejectedByOperators: string[];
  isConfirmed?: boolean;
  routePrice?: string;
  routeAircraft?: string;
  routeOperator?: string;
  routeRating?: number;
  routeDuration?: string;
  isOperatorApprovalRequired?: boolean;
  operatorApprovalStatus?: 'pending' | 'approved' | 'rejected' | 'expired';
  operatorApprovalDeadline?: string;
  acceptedOffer?: {
    id: string;
    operatorName: string;
    aircraft: string;
    price: string;
    message?: string;
    offerDate: string;
    discountApplied?: boolean;
    discountPercentage?: number;
  };
  isPaid?: boolean;
  paidAt?: string;
  paymentMethod?: string;
  transactionId?: string;
  isCancelled?: boolean;
  cancellationInfo?: any;
  finalPrice?: number;
  discountAmount?: number;
  originalPrice?: string;
  discountPercentage?: number;
  discountRequested?: boolean;
  customerMembershipType?: string;
  selectedRoute?: {
    id: string;
    from: string;
    to: string;
    price: string;
    aircraft: string;
    operator: string;
    duration: string;
    rating: number;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  bookingRequests: BookingRequest[];
  addBookingRequest: (request: BookingRequest) => void;
  updateBookingRequest: (id: string, updates: Partial<BookingRequest>) => void;
  setUser: (user: User | null) => void;
  setBookings: (bookings: any[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && parsedUser.id) {
          setUser(parsedUser);
        }
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  }, []);

  // Load booking requests from localStorage
  useEffect(() => {
    try {
      const savedRequests = localStorage.getItem('bookingRequests');
      if (savedRequests && savedRequests !== 'undefined' && savedRequests !== 'null') {
        const parsedRequests = JSON.parse(savedRequests);
        if (Array.isArray(parsedRequests)) {
          setBookingRequests(parsedRequests);
        } else {
          setBookingRequests([]);
        }
      } else {
        setBookingRequests([]);
      }
    } catch (error) {
      console.error('Error loading booking requests:', error);
      setBookingRequests([]);
    }
  }, []);

  const generateBookingNumber = (): string => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `BID${timestamp}${random}`;
  };

  const login = async (email: string, password: string, role: string): Promise<void> => {
    try {
      // Demo accounts
      const demoAccounts = [
        { email: 'demo@customer.com', password: '123456', role: 'customer' },
        { email: 'customer@jetup.aero', password: 'Osar2024/istanbul', role: 'customer' },
        { email: 'operator@jetup.aero', password: 'Osar2024/istanbul', role: 'operator' },
        { email: 'admin@jetup.aero', password: 'Osar2024/istanbul', role: 'admin' }
      ];
      
      const demoAccount = demoAccounts.find(acc => 
        acc.email === email && acc.password === password && acc.role === role
      );
      
      if (demoAccount) {
        const mockUser: User = {
          id: demoAccount.email,
          name: demoAccount.email === 'customer@jetup.aero' ? 'Premium Customer' :
                demoAccount.role === 'customer' ? 'Demo Customer' : 
                demoAccount.role === 'operator' ? 'Demo Operator' : 'Demo Admin',
          email: demoAccount.email,
          role: demoAccount.role as any,
          membershipType: demoAccount.email === 'customer@jetup.aero' ? 'premium' : 
                        demoAccount.role === 'customer' ? 'premium' : 
                        demoAccount.email === 'operator@jetup.aero' ? 'yearly' : undefined,
          membershipExpiryDate: demoAccount.role === 'customer' ? 
           new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : 
           demoAccount.email === 'operator@jetup.aero' ? 
           new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : undefined,
          hasMembership: demoAccount.role === 'customer',
          profileCompletionStatus: 'approved',
          hasUploadedID: true,
          isApprovedByAdmin: demoAccount.email === 'operator@jetup.aero' ? true : true,
          hasUploadedAOC: demoAccount.email === 'operator@jetup.aero' ? true : demoAccount.role === 'operator',
          operatorId: demoAccount.email === 'operator@jetup.aero' ? 'OID00001' : 
                    demoAccount.role === 'operator' ? 'OID00002' : undefined,
          customerId: demoAccount.email === 'customer@jetup.aero' ? 'CID00002' : 
                     demoAccount.role === 'customer' ? 'CID00001' : undefined,
          firstName: demoAccount.email === 'customer@jetup.aero' ? 'Premium' : 'Demo',
          lastName: demoAccount.email === 'customer@jetup.aero' ? 'Customer' : 'User',
          phone: demoAccount.email === 'customer@jetup.aero' ? '+1 (555) 987-6543' : '+1 (555) 123-4567',
          address: demoAccount.email === 'customer@jetup.aero' ? {
            street: '456 Premium Avenue',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90210',
            country: 'United States'
          } : undefined,
          memberSince: demoAccount.email === 'customer@jetup.aero' ? '2023-12-01' : '2024-01-15',
          bookingCount: 0,
          bookingLimit: 10,
          cancellationCount: 0,
          cancellationLimit: 10,
          operatorCancellationCount: demoAccount.email === 'operator@jetup.aero' ? 0 : undefined,
          operatorCancellationLimit: demoAccount.email === 'operator@jetup.aero' ? 25 : undefined,
          discountUsage: {},
          totalDiscountsUsed: 0,
          operatorName: demoAccount.email === 'operator@jetup.aero' ? 'Premium Aviation Ltd.' : undefined
        };
        setUser(mockUser);
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        return;
      }
      
      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, role: string): Promise<void> => {
    try {
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        role: role as any,
        membershipType: role === 'customer' ? 'standard' : undefined,
        profileCompletionStatus: 'incomplete',
        hasUploadedID: false,
        isApprovedByAdmin: false,
        hasUploadedAOC: false,
        operatorId: role === 'operator' ? `OID${Date.now().toString().slice(-5)}` : undefined,
        customerId: role === 'customer' ? `CID${Date.now().toString().slice(-5)}` : undefined
      };
      
      setUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  const addBookingRequest = (request: BookingRequest) => {
    const bookingNumber = generateBookingNumber();
    const requestWithNumber = { ...request, bookingNumber };
    const updatedRequests = [...bookingRequests, requestWithNumber];
    setBookingRequests(updatedRequests);
    localStorage.setItem('bookingRequests', JSON.stringify(updatedRequests));
  };

  const updateBookingRequest = (id: string, updates: Partial<BookingRequest>) => {
    const updatedRequests = bookingRequests.map(request =>
      request.id === id ? { ...request, ...updates } : request
    );
    setBookingRequests(updatedRequests);
    localStorage.setItem('bookingRequests', JSON.stringify(updatedRequests));
  };

  const setBookings = (bookings: any[]) => {
    setBookingRequests(bookings);
    localStorage.setItem('bookingRequests', JSON.stringify(bookings));
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    bookingRequests,
    addBookingRequest,
    updateBookingRequest,
    setUser,
    setBookings
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
