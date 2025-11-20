import CreateCatalogueForm from '@/components/brands/catalogue/CreateCatalogueForm';
import BackgroundContainer from '@/components/common/BackgroundContainer';
import React from 'react';
const editCatalogue = () => {
  return (
    <BackgroundContainer>
      <CreateCatalogueForm isEdit={true}></CreateCatalogueForm>
    </BackgroundContainer>
  )
}

export default editCatalogue