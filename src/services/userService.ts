import { Postdoc, Education, Training, WorkExperience } from "@/types/user"
import Cookies from "js-cookie"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const userService = {
  // Intern Profile --------------------------------------------------------
  // ฟังก์ชันค้นหานักวิจัย Postdoc
  async searchPostdocs(searchTerm: string = ""): Promise<Postdoc[]> {
    try {
      // สร้าง URL สำหรับการค้นหา
      const searchUrl = searchTerm 
        ? `${API_URL}/postdoc/search/?q=${encodeURIComponent(searchTerm)}`
        : `${API_URL}/postdoc/`
      
      // ไม่จำเป็นต้องส่ง Authorization header สำหรับการค้นหาสาธารณะ
      const response = await fetch(searchUrl, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to search postdocs")
      }

      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error("Error searching postdocs:", error)
      return []
    }
  },

  // ฟังก์ชันดึงข้อมูล Postdoc ตาม ID
  async getPostdocById(postdocId: number): Promise<Postdoc | null> {
    try {
      // ไม่จำเป็นต้องส่ง Authorization header สำหรับการดูข้อมูลสาธารณะ
      const response = await fetch(`${API_URL}/postdoc/${postdocId}/`, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch postdoc")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching postdoc by id:", error)
      return null
    }
  },

  // ฟังก์ชันดึงข้อมูลโปรไฟล์ของนักศึกษาฝึกงาน
  async getProfile(): Promise<Postdoc | null> {
    try {
      const token = Cookies.get("accessToken")
      const user = Cookies.get("user")
      const userData = user ? JSON.parse(user) : null
      const userId = userData?.id

      // อ่านข้อมูลโปรไฟล์ของนักศึกษาฝึกงานจาก API
      const response = await fetch(`${API_URL}/postdoc/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch Postdoc")
      }

      const postdoc = await response.json()

      // กรองข้อมูล intern ตาม user_id ของนักศึกษาฝึกงาน
      const userPostdoc = postdoc.find(
        (postdoc: Postdoc) => postdoc.user_id === userId
      )
      return userPostdoc || null
    } catch (error) {
      console.error("Error fetching profile:", error)
      return null
    }
  },
  // สร้างข้อมูลโปรไฟล์ใหม่ของนักศึกษา
  async createProfile(profileData: Postdoc): Promise<Postdoc> {
    try {
      const token = Cookies.get("accessToken");
      
      // ใช้ JSON format แทน FormData
      const response = await fetch(`${API_URL}/postdoc/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Server response:", errorData);
        throw new Error(`Failed to create profile: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating profile:", error);
      throw error;
    }
  },
  
  // อัพเดทข้อมูลโปรไฟล์
  async updateProfile(profileData: Postdoc): Promise<Postdoc> {
    try {
      const token = Cookies.get("accessToken");
      
      // ใช้ JSON format แทน FormData
      const response = await fetch(`${API_URL}/postdoc/${profileData.id}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        // เพิ่มการอ่านและแสดงข้อผิดพลาดอย่างละเอียด
        const errorText = await response.text();
        console.error("Server response error:", errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          console.error("Parsed error data:", errorData);
        } catch (_) {
          // หากไม่สามารถแปลงเป็น JSON ได้
        }
        
        throw new Error(`Failed to update profile: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },


  // Education Profile -------------------------------------------------------
  // ฟังก์ชันดึงข้อมูลการศึกษาของนักศึกษาฝึกงาน
  async getEducation(): Promise<Education | null> {
    try {
      const token = Cookies.get("accessToken")
      const user = Cookies.get("user")
      const userData = user ? JSON.parse(user) : null
      const userId = userData?.id

      const response = await fetch(`${API_URL}/educations/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch education")
      }

      const educations = await response.json()
      // กรองข้อมูลการศึกษาตาม user_id
      const userEducation = educations.find(
        (edu: Education) => edu.user_id === userId
      )
      return userEducation || null
    } catch (error) {
      console.error("Error fetching education:", error)
      return null
    }
  },

  // ฟังก์ชันสร้างข้อมูลการศึกษาใหม่
  async createEducation(educationData: Education): Promise<Education> {
    try {
      const token = Cookies.get("accessToken")
      const response = await fetch(`${API_URL}/educations/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(educationData),
      })

      if (!response.ok) {
        throw new Error("Failed to create education")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error creating education:", error)
      throw error
    }
  },

  // ฟังก์ชันอัพเดทข้อมูลการศึกษา
  async updateEducation(educationData: Education): Promise<Education> {
    try {
      const token = Cookies.get("accessToken")
      const response = await fetch(
        `${API_URL}/educations/${educationData.id}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(educationData),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to update education")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error updating education:", error)
      throw error
    }
  },

  // Training Profile -------------------------------------------------------
  // ฟังก์ชันดึงข้อมูลการฝึกอบรมของนักศึกษาฝึกงาน
  async getTrainings(): Promise<Training[]> {
    try {
      const token = Cookies.get("accessToken")
      const user = Cookies.get("user")
      const userData = user ? JSON.parse(user) : null
      const userId = userData?.id

      const response = await fetch(`${API_URL}/trainings/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch trainings")
      }

      const trainings = await response.json()
      // กรองข้อมูลการอบรมตาม user_id
      const userTrainings = trainings.filter(
        (training: Training) => training.user_id === userId
      )
      return userTrainings || []
    } catch (error) {
      console.error("Error fetching trainings:", error)
      return []
    }
  },

  // ฟังก์ชันสร้างข้อมูลการฝึกอบรมใหม่
  async createTraining(trainingData: Training): Promise<Training> {
    try {
      const token = Cookies.get("accessToken")
      const response = await fetch(`${API_URL}/trainings/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trainingData),
      })

      if (!response.ok) {
        throw new Error("Failed to create training")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error creating training:", error)
      throw error
    }
  },

  // ฟังก์ชันอัพเดทข้อมูลการฝึกอบรม
  // อัพเดทข้อมูลการอบรม
  async updateTraining(trainingData: Training): Promise<Training> {
    try {
      const token = Cookies.get("accessToken")
      const response = await fetch(`${API_URL}/trainings/${trainingData.id}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trainingData),
      })

      if (!response.ok) {
        throw new Error("Failed to update training")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error updating training:", error)
      throw error
    }
  },

  // Work Experience Profile -------------------------------------------------------
  // ฟังก์ชันดึงข้อมูลประสบการณ์การทำงานของนักศึกษาฝึกงาน
  async getWorkExperiences(): Promise<WorkExperience[]> {
    try {
      const token = Cookies.get("accessToken")
      const user = Cookies.get("user")
      const userData = user ? JSON.parse(user) : null
      const userId = userData?.id

      const response = await fetch(`${API_URL}/work-experiences/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch work experiences")
      }

      const workExperiences = await response.json()
      // กรองข้อมูลการทำงานตาม user_id
      const userWorkExperiences = workExperiences.filter(
        (exp: WorkExperience) => exp.user_id === userId
      )
      return userWorkExperiences || []
    } catch (error) {
      console.error("Error fetching work experiences:", error)
      return []
    }
  },

  // ฟังก์ชันสร้างข้อมูลประสบการณ์การทำงานใหม่
  async createWorkExperience(
    workData: WorkExperience
  ): Promise<WorkExperience> {
    try {
      const token = Cookies.get("accessToken")
      const response = await fetch(`${API_URL}/work-experiences/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workData),
      })

      if (!response.ok) {
        throw new Error("Failed to create work experience")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error creating work experience:", error)
      throw error
    }
  },

  // ฟังก์ชันอัพเดทข้อมูลประสบการณ์การทำงาน
  async updateWorkExperience(
    workData: WorkExperience
  ): Promise<WorkExperience> {
    try {
      const token = Cookies.get("accessToken")
      const response = await fetch(
        `${API_URL}/work-experiences/${workData.id}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(workData),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to update work experience")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error updating work experience:", error)
      throw error
    }
  },
  
}