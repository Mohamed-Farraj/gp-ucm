import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  constructor() { }

  
      //#region pagination methods
    
      getDisplayedPages(totalPages:number, currentPage: number): number[] {
        let startPage: number, endPage: number;
        if (totalPages === 0) return [];
        if (totalPages <= 5) {
          startPage = 1;
          endPage = totalPages;
        } else {
          if (currentPage <= 3) {
            startPage = 1;
            endPage = 5;
          } else if (currentPage + 2 >= totalPages) {
            startPage = totalPages - 4;
            endPage = totalPages;
          } else {
            startPage = currentPage - 2;
            endPage = currentPage + 2;
          }
        }
        
        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
        return pages;
      }
      //#endregion
    
  

}
