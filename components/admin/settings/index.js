import FAQSettings from "./faqSettings";
import PhaseSettings from "./phaseSettings";

export default function Settings(){
    return(
        <div className="pb-16">
        <PhaseSettings/>
        <FAQSettings/>
        </div>
        
    )
}