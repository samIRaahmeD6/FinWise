import Navbar from "../components/Navbar";
import AllTransactionCards from "../components/AllTransactionCards";
export const AllTransaction = () => {
  return (
    <>
     <div className="flex h-screen w-screen bg-[#FFF8D4]">
          {/* Sidebar */}
          <div className="w-64 h-screen bg-[#313647]">
            <Navbar />
          </div>

          <AllTransactionCards/>
   </div>
    </>
  )
}

export default AllTransaction