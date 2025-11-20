import CreateCatalogueForm from '@/components/brands/catalogue/CreateCatalogueForm';
import BackgroundContainer from '@/components/common/BackgroundContainer';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useSelector } from 'react-redux';

const createCatalogue = () => {
  const { type } = useLocalSearchParams<{ type?: 'CREATE' | 'EDIT' }>();
  const { renderKey } = useSelector((state: any) => state.post)
  return (
    <BackgroundContainer>
      <CreateCatalogueForm key={renderKey} isEdit={type == 'EDIT'}></CreateCatalogueForm>
    </BackgroundContainer>
  )
}

export default createCatalogue