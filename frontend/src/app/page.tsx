import Image from "next/image";
import { GoogleGeminiEffectDemo } from "./components/Hero";
import { CardHoverEffectDemo } from "./components/Cards";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <>
    <GoogleGeminiEffectDemo/>
    <CardHoverEffectDemo/>
    </>
  );
}
