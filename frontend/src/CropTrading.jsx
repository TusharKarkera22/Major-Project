import React, { useState, useEffect } from 'react';
import ListCrop from './components/ListCrop/ListCrop';
import PurchaseCrop from './components/PurchaseCrop/PurchaseCrop';
import RemoveCrop from './components/RemoveCrop/RemoveCrop';
import CropDetails from './components/CropDetails/CropDetails';
import BatchPurchaseCrop from './components/BatchPurchaseCrop/BatchPurchaseCrop';
import UserCrops from './components/UserCrops/UserCrops';
import AdminWithdraw from './components/AdminWithdraw/AdminWithdraw';
import CropList from './components/CropList/CropList';
import { ethers } from 'ethers';

const CropTrading = ({ signer, contractBundle }) => {
  const [activeComponent, setActiveComponent] = useState('CropList');
  const [isAdmin, setIsAdmin] = useState(false);

  const checkIfAdmin = async () => {
    try {
      const adminAddress = await contractBundle.cropTradingContract.admin();
      const signerAddress = await signer.getAddress();
      setIsAdmin(signerAddress.toLowerCase() === adminAddress.toLowerCase());
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  useEffect(() => {
    checkIfAdmin();
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="font-contax text-3xl">Crop Trading Platform</h1>
      <div className="flex gap-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setActiveComponent('CropList')}>View Crops</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setActiveComponent('ListCrop')}>List Crop</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setActiveComponent('PurchaseCrop')}>Purchase Crop</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setActiveComponent('BatchPurchaseCrop')}>Batch Purchase</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setActiveComponent('RemoveCrop')}>Remove Crop</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setActiveComponent('CropDetails')}>Crop Details</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setActiveComponent('UserCrops')}>My Crops</button>
        {isAdmin && (
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => setActiveComponent('AdminWithdraw')}>Admin Withdraw</button>
        )}
      </div>

      <div className="mt-6">
        {activeComponent === 'CropList' && <CropList signer={signer} contractBundle={contractBundle} />}
        {activeComponent === 'ListCrop' && <ListCrop signer={signer} contractBundle={contractBundle} />}
        {activeComponent === 'PurchaseCrop' && <PurchaseCrop signer={signer} contractBundle={contractBundle} />}
        {activeComponent === 'BatchPurchaseCrop' && <BatchPurchaseCrop signer={signer} contractBundle={contractBundle} />}
        {activeComponent === 'RemoveCrop' && <RemoveCrop signer={signer} contractBundle={contractBundle} />}
        {activeComponent === 'CropDetails' && <CropDetails signer={signer} contractBundle={contractBundle} />}
        {activeComponent === 'UserCrops' && <UserCrops signer={signer} contractBundle={contractBundle} />}
        {activeComponent === 'AdminWithdraw' && <AdminWithdraw signer={signer} contractBundle={contractBundle} />}
      </div>
    </div>
  );
};

export default CropTrading;
