import { LoginFormData, AuthTokens, User } from '@/types/auth'
import Cookies from 'js-cookie'

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authService = {
  async login(credentials: LoginFormData): Promise<{ tokens: AuthTokens; user: User }> {
    const response = await fetch(`${API_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    return {
      tokens: {
        access: data.access,
        refresh: data.refresh
      },
      user: data.user
    };
    
  },
  
  saveTokens(tokens: AuthTokens): void {
    Cookies.set('accessToken', tokens.access, {
      secure: process.env.NODE_ENV === 'production',
      expires: 7, // 7 days
      path: '/'
    })
    Cookies.set('refreshToken', tokens.refresh, {
      secure: process.env.NODE_ENV === 'production',
      expires: 7,
      path: '/'
    })
  },

  saveUser(user: User): void {
    // เพิ่มการตรวจสอบว่า user มีค่าและมีคุณสมบัติที่จำเป็นหรือไม่
    if (user && typeof user === 'object') {
      Cookies.set('user', JSON.stringify(user), {
        secure: process.env.NODE_ENV === 'production',
        expires: 7,
        path: '/'
      })
    } else {
      console.error('Invalid user data:', user);
    }
  },

  getUser(): User | null {
    try {
      const userStr = Cookies.get('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  clearAuth(): void {
    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')
    Cookies.remove('user')
  },
  
  // ฟังก์ชันสำหรับล็อกอินอัตโนมัติพร้อมเช็ค role และเปลี่ยนเส้นทาง
  async autoLogin(credentials: LoginFormData): Promise<{ tokens: AuthTokens; user: User }> {
    const response = await this.login(credentials);
    this.saveTokens(response.tokens);
    this.saveUser(response.user);
    
    // เช็ค role ของผู้ใช้และนำทางไปหน้าที่เหมาะสม
    this.routeBasedOnRole();
    
    return response;
  },
  
  // ฟังก์ชันสำหรับตรวจสอบ role และเปลี่ยนเส้นทาง
  routeBasedOnRole(): void {
    const user = this.getUser();
    
    if (user) {
      // log ข้อมูลผู้ใช้เพื่อตรวจสอบ
      console.log('User data for routing:', user);
      
      // เช็คว่าผู้ใช้มี role เป็น staff หรือไม่ และตรวจสอบว่า is_staff มีค่าเป็น boolean หรือไม่
      if (user.is_staff === true) {
        // ถ้าเป็น staff ให้ไปที่หน้า admin-profile
        console.log('Redirecting to admin ...');
        window.location.href = '/admin-postdoc';
      } else {
        // ถ้าไม่ใช่ staff ให้ไปที่หน้า user_dashboard
        console.log('Redirecting to user ...');
        window.location.href = '/user/dashboard';
      }
    } else {
      console.error('No user data found for routing');
      // ถ้าไม่มีข้อมูลผู้ใช้ ให้ไปยังหน้าล็อกอิน
      window.location.href = '/login';
    }
  },
  
  // ฟังก์ชันสำหรับตรวจสอบสิทธิ์ในการเข้าถึงหน้า admin
  checkAdminAccess(): boolean {
    const user = this.getUser();
    return user ? Boolean(user.is_staff) : false;
  },
  
  // ฟังก์ชันสำหรับตรวจสอบว่าผู้ใช้ล็อกอินแล้วหรือไม่
  isAuthenticated(): boolean {
    const token = Cookies.get('accessToken');
    const user = this.getUser();
    return !!(token && user);
  }
}