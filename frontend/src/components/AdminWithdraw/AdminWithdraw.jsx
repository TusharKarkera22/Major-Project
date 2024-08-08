import React from 'react';

const AdminWithdraw = ({ signer, contractBundle }) => {

  const withdraw = async () => {
    try {
      const tx = await contractBundle.cropTradingContract.withdraw();
      await tx.wait();
      console.log("Funds withdrawn successfully.");
    } catch (error) {
      console.error("Error withdrawing funds:", error);
    }
  };

  return (
    <div className='flex flex-col justify-evenly w-[600px] h-[400px] gap-6 items-center bg-white rounded-xl'>
      <h1 className='font-contax text-2xl'>Admin Withdraw</h1>
      <button className='bg-red-500 text-white px-4 py-2 rounded' onClick={withdraw}>
        Withdraw Funds
      </button>
    </div>
  );
};

export default AdminWithdraw;
