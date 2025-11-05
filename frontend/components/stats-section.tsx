"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export default function StatsSection() {
  const { t } = useLanguage();
  const [stats, setStats] = useState([
    { value: "10+", label: t("stats.partnerHospitals"), color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
    { value: "10+", label: t("stats.medicalSpecialists"), color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
    { value: "24/7", label: t("stats.availability"), color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
    { value: "300+", label: t("stats.patientsServed"), color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch hospital count
        const hospitalsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/hospitals/count`, {
          credentials: 'include'
        });
        let hospitalCount = 10;
        if (hospitalsRes.ok) {
          const hospitalsData = await hospitalsRes.json();
          hospitalCount = hospitalsData?.count || 10;
        }

        // Fetch doctor count
        const doctorsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/doctors`, {
          credentials: 'include'
        });
        let doctorCount = 50;
        if (doctorsRes.ok) {
          const doctorsData = await doctorsRes.json();
          doctorCount = doctorsData?.data?.doctors?.length || 50;
        }

        // Fetch patient count
        const patientsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/patients/count`, {
          credentials: 'include'
        });
        let patientCount = 300;
        if (patientsRes.ok) {
          const patientsData = await patientsRes.json();
          patientCount = patientsData?.count || 300;
        }

        setStats([
          { value: `${hospitalCount}+`, label: t("stats.partnerHospitals"), color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
          { value: `${doctorCount}+`, label: t("stats.medicalSpecialists"), color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
          { value: "24/7", label: t("stats.availability"), color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
          { value: `${patientCount}+`, label: t("stats.patientsServed"), color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" },
        ]);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [t]);

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className={`p-8 ${index > 0 ? "border-l border-gray-100 dark:border-gray-700" : ""} text-center`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div
                  className={`inline-block px-3 py-1 rounded-full ${stat.color} text-sm font-medium mb-4`}
                >
                  {stat.label}
                </div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

          { value: `${patientCount}+`, label: t("stats.patientsServed"), color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" },
        ]);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [t]);

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className={`p-8 ${index > 0 ? "border-l border-gray-100 dark:border-gray-700" : ""} text-center`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div
                  className={`inline-block px-3 py-1 rounded-full ${stat.color} text-sm font-medium mb-4`}
                >
                  {stat.label}
                </div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
