import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {

  transform(myArray:any[] , term:string , propertyName:string): any[] {
    if (!term || term.trim() === '') return myArray;
    if (!myArray || !propertyName) return [];

    const searchTerm = term.toLowerCase();
    
    return myArray.filter(item => {
      const itemValue = item[propertyName]?.toString().toLowerCase();
      return itemValue?.includes(searchTerm);
      });
  }

}
