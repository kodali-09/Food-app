import {PipeTransform,Pipe } from '@angular/core';
@Pipe({
    name:'Recipefilter'
})
export class RecipefilterPipe implements PipeTransform
{
    transform(recipes:any, searchTerm:string):any{     
        if(!recipes || !searchTerm)
        return recipes;
        return recipes.filter(recipe1=>
            recipe1["recipe"].toLowerCase().indexOf(searchTerm)!=-1);
    }
}
