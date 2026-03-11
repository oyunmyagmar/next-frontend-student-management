import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../../utils/axiosInstance";

const { Title } = Typography;

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/api/students/${params.id}`);
        setStudent(response);
      } catch (error) {
        console.error("Мэдээлэл татахад алдаа гарлаа:", error);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchStudentDetails();
  }, [params.id]);

  return <div>dsfdf</div>;
}
