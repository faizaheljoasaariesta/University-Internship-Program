import { 
  Contact,
  StarsCanvas
} from "../components"

const Contacts = () => {
  return (
    <div className="relative z-0 bg-primary overflow-x-hidden">
      <div className='relative z-0'>
        <Contact />
        <StarsCanvas />
      </div>
    </div>
  )
}

export default Contacts
