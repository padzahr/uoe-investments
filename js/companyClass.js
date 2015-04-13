/* 
 * Copyright (C) 2015 Hadi Mehrpouya
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */




function Company (_name,_amount,_position,_size) {
    this.name = _name;
    this.amount= _amount;
    this.position = _position;
    this.size = _size;
    this.path="";
//    this.getInfo = function() {
//        return this.color + ' ' + this.type + ' apple';
//    };
}

Company.prototype.getName=function(){
    console.log(this.name);
};
Company.prototype.getAmount=function(){
    return this.amount;
};
Company.prototype.getPosition=function(){
    return this.position;
};
//Company.prototype.getSize=function(){
//    return this.size;
//};