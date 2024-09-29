import Footer from "@/app/components/footer/Footer";
import ImageSlider from "@/app/components/imageslider/ImageSlider";
import Info from "@/app/components/info/Info";
import NavBar from "@/app/components/navbar/NavBar";
import { app, auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

const HomePage = () => {
   
  return (
    <div>
      <NavBar/>
      <ImageSlider/>
      <Info/>
      <Footer/>
      
    </div>
  )
}

export default HomePage;
