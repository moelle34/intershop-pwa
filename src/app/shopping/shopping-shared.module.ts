import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CategoryNavigationComponent } from './components/category//category-navigation/category-navigation.component';
import { CategoryListComponent } from './components/category/category-list/category-list.component';
import { ProductAddToCartComponent } from './components/product/product-add-to-cart/product-add-to-cart.component';
import { ProductAttributesComponent } from './components/product/product-attributes/product-attributes.component';
import { ProductDetailActionsComponent } from './components/product/product-detail-actions/product-detail-actions.component';
import { ProductImageComponent } from './components/product/product-image/product-image.component';
import { ProductImagesComponent } from './components/product/product-images/product-images.component';
import { ProductInventoryComponent } from './components/product/product-inventory/product-inventory.component';
import { ProductListToolbarComponent } from './components/product/product-list-toolbar/product-list-toolbar.component';
import { ProductListComponent } from './components/product/product-list/product-list.component';
import { ProductPriceComponent } from './components/product/product-price/product-price.component';
import { ProductQuantityComponent } from './components/product/product-quantity/product-quantity.component';
import { ProductRowActionsComponent } from './components/product/product-row-actions/product-row-actions.component';
import { ProductRowComponent } from './components/product/product-row/product-row.component';
import { ProductShipmentComponent } from './components/product/product-shipment/product-shipment.component';
import { ProductTileActionsComponent } from './components/product/product-tile-actions/product-tile-actions.component';
import { ProductTileComponent } from './components/product/product-tile/product-tile.component';
import { ProductDetailActionsContainerComponent } from './containers/product-detail-actions/product-detail-actions.container';
import { ProductRowActionsContainerComponent } from './containers/product-row-actions/product-row-actions.container';
import { ProductTileActionsContainerComponent } from './containers/product-tile-actions/product-tile-actions.container';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    CategoryListComponent,
    CategoryNavigationComponent,
    ProductAttributesComponent,
    ProductImagesComponent,
    ProductImageComponent,
    ProductListComponent,
    ProductPriceComponent,
    ProductRowComponent,
    ProductTileComponent,
    ProductPriceComponent,
    ProductInventoryComponent,
    ProductShipmentComponent,
    ProductListToolbarComponent,
    ProductTileActionsContainerComponent,
    ProductTileActionsComponent,
    ProductRowActionsContainerComponent,
    ProductRowActionsComponent,
    ProductQuantityComponent,
    ProductAddToCartComponent,
    ProductDetailActionsComponent,
    ProductDetailActionsContainerComponent
  ],
  exports: [
    CategoryListComponent,
    CategoryNavigationComponent,
    ProductAttributesComponent,
    ProductImageComponent,
    ProductImagesComponent,
    ProductListComponent,
    ProductRowComponent,
    ProductTileComponent,
    ProductPriceComponent,
    ProductInventoryComponent,
    ProductShipmentComponent,
    ProductListToolbarComponent,
    ProductTileActionsContainerComponent,
    ProductTileActionsComponent,
    ProductRowActionsContainerComponent,
    ProductRowActionsComponent,
    ProductQuantityComponent,
    ProductAddToCartComponent,
    ProductDetailActionsComponent,
    ProductDetailActionsContainerComponent
  ]
})

export class ShoppingSharedModule { }
