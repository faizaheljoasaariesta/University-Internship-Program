import { useRef, useState } from "react";
import { motion } from "framer-motion";

import { styles } from "../style";
import { AntennaLogin, StarsCanvas } from "./canvas";
import { slideIn } from "../utils/motion";

import { useNavigate } from 'react-router-dom';

import { dirgantara, defense, ugm } from '../assets'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { target } = e;
    const { name, value } = target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (form.username === import.meta.env.VITE_USERNAME_LOGIN && form.password === import.meta.env.VITE_PASSWORD_LOGIN) {
      toast.success(`Login Success, Selamat datang di Monitoring Tracking Antenna`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      setLoading(false);

      setForm({
        username: "",
        password: "",
      });

      setTimeout(() => {
        navigate("/dirgantara/monitoring", { replace: true });
        setActive("");
        window.scrollTo(0, 0);
      }, 1000);
    } else {
      toast.error('Username atau Password yang digunakan salah!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setLoading(false);
      setForm({
        username: "",
        password: "",
      });
    }
  };

  return (
    <div
      className={`m-5 xl:m-20 flex xl:flex-row flex-col gap-10 overflow-hidden`}
    >
      <StarsCanvas />
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className='xl:flex-1 xl:h-[800px] md:h-[550px] h-[350px]'
      >
        <div className="flex gap-4 items-center mb-10">
          <img 
            src={dirgantara}
            alt="dirgantara" 
            className="w-auto h-12 object-contain" 
          />
          <img 
            src={defense}
            alt="defense" 
            className="w-auto h-7 object-contain" 
          />
          <img 
            src={ugm}
            alt="ugm" 
            className="w-auto h-10 object-contain" 
          />
        </div>
        <p className={styles.sectionSubText}>PT. Dirgantara Indonesia</p>
        <h3 className={styles.sectionSubText}>Automatic Tracking Antenna Flight and Test Center.</h3>

        <AntennaLogin />
      </motion.div>

      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className='flex-[0.75] p-8 bg-black-100 rounded-2xl'
      >
        <p className={styles.sectionSubText}>Get in touch</p>
        <h3 className={styles.sectionHeadText}>Login Form.</h3>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className='mt-12 flex flex-col gap-8'
        >
          <label className='flex flex-col'>
            <span className='text-white font-medium mb-4'>Username</span>
            <input
              type='text'
              name='username'
              value={form.username}
              onChange={handleChange}
              placeholder="What's your username?"
              className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium'
            />
          </label>
          <label className='flex flex-col'>
            <span className='text-white font-medium mb-4'>Password</span>
            <input
              type='password'
              name='password'
              value={form.password}
              onChange={handleChange}
              placeholder="What's your password?"
              className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium'
            />
          </label>

          <button
            type='submit'
            className='bg-green-800 py-3 px-8 rounded-xl outline-none w-full text-white font-bold shadow-md shadow-primary hover:bg-green-900'
          >
            {loading ? "Logingin..." : "Login"}
          </button>

          <p className="text-center mt-16">"Pengembangan Sistem <span className="font-bold">Autotracking Telemetry Antenna</span> Pusat Pengendalian Uji Terbang menggunakan <span className="font-bold">Data ADS-B</span> dengan Penerapan <span className="font-bold">Logika Kontrol Fuzzy</span> berbasis Website."</p>

        </form>
      </motion.div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  )
}

export default LoginPage;