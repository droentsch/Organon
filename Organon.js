/*
# Organon0.1.1.f - The DOM-flattening, relational framework
#
# Copyright (c) 2008 Dan Roentsch (www.danroentsch.com)
#  This program is free software: you can redistribute it and/or modify
#   it under the terms of the GNU General Public License as published by
#   the Free Software Foundation, either version 3 of the License, or
#   (at your option) any later version.
#
#   This program is distributed in the hope that it will be useful,
#   but WITHOUT ANY WARRANTY; without even the implied warranty of
#   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#   GNU General Public License for more details.
#
#   You should have received a copy of the GNU General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var ari =
{  
  //array of made objects
    "organon" : [],
    //incrementing id for each made object
    "organonId" : 0,
    "AriVersion" : "Organon 0.1.1.f",
    //the enclosing function
    "make" : function(element_or_id)
    {
		var that = this;
        if (that.IsEmpty(element_or_id)) {return null;}
        var l = element_or_id;
        var ll = null;
        if (typeof(l) == "string")
        {
            ll = document.getElementById(l);
            if (ll === null) {return null;}
        }
        else
        {
            ll = l;
        }

        var theValue = null;
        var theValues = [];
        var isHidden = null;
        ll.removeChildNodes = function()
        {
            if (!that.IsEmpty(this.childNodes))
            {
                for (var i=0;i<this.childNodes.length;i++)
                {
                    this.removeChild(this.childNodes[i]);
                }
            }
            return this;
        }
        //usesClass()
        ll.usesClass = function(class_name)
        {
            if (that.IsEmpty(class_name)){return false;}
            this.getValues("class");
            if (that.IsEmpty(theValues)) {return false;}
            for (var i = 0; i < theValues.length; i++)
            {
                if (theValues[i] == class_name) {return true;}
            }
            return false;
        }
        ;
        ll.usesStyle = function(style_name)
        {
            if (that.IsEmpty(style_name))return false;
            this.getValues("style");
            if (that.IsEmpty(theValues)) return false;
            for (var i = 0; i < theValues.length; i++)
            {
                if (theValues[i] == style_name) return true;
            }
            return false;
        }
        ;
        ll.has = function(attrib_name, attrib_value)
        {
            if (typeof attrib_name === undefined) return false;
            if (typeof attrib_value === undefined) return false;
            if(typeof this.attributes[attrib_name] === undefined) return false;
            this.getValues(attrib_name);
            for (var i = 0; i < theValues.length; i ++ )
            {
                if (theValues[i] == attrib_value) return true;
            }
            return false;
        } //end has()
        ;
        //drop()
        ll.drop = function(attrib_name)
        {
            if (typeof attrib_name === undefined) return false;
            ll.removeAttribute(attrib_name);
            return;
        }
        ;
        // getValues()
        ll.getValues = function(attrib_name)
        {
            var splitToken = " ";
            var upperAttrib = attrib_name.toUpperCase();
            if (upperAttrib == "STYLE")
            {
                splitToken = ";";
            }
            var val = this.getAttributeNode(attrib_name)
            if (!ari.IsEmpty(val))
            {
				val = val.value;
            }
            var vals = [];
            if (ari.IsEmpty(val))
            {
                theValues = null;
                return;
            }
            else
            {
                theValue = val.toString();
                if (theValue.indexOf(splitToken) == - 1 && theValue.length > 0) theValues[0] = theValue;
                if (theValue.indexOf(splitToken) != - 1) theValues = theValue.split(splitToken);
            }
            return theValues;
        }
        ;
        ll.setValue = function(attrib_name, attrib_value)
        {
			if (attrib_name.toUpperCase() == "STYLE")
			{
			    this.setStyle(attrib_value);
			    return this;
			}
			var attr = document.createAttribute(attrib_name);
			attr.nodeValue = attrib_value;
					
			try
			{
				this.setAttributeNode(attr);
			}
			catch(err)
			{
				;
			}
            return this;
        }
        ;
        ll.getValue = function()
        {
            switch (this.tagName.toUpperCase())
            {
                case "INPUT" :
                    if (this.getAttribute("type").toUpperCase() == "TEXT") return this.value;
                    break;
                case "SELECT" :
                    if (typeof(this.options) !== undefined && this.options !== null && this.selectedIndex !== null)
                    {
                        return this.options[this.selectedIndex].value;
                    }
                    break;
                case "BUTTON" :
                    if (typeof(this.textContent) !== undefined && this.textContent !== null) return this.textContent;
                    if (typeof(this.innerText) !== undefined && this.innerText !== null) return this.innerText;
                    break;
                default :
                    if (typeof(this.innerHTML) !== undefined && this.innerHTML !== null) return this.innerHTML;
            }
            return null;
        }
        ;
        ll.setClass = function (attrib_value)
        {
            if (ari.IsEmpty(attrib_value)) return null;
            if (this.usesClass(attrib_value)) return;
            this.setValue("class", this.theValues.join(" ")+attrib_value);
        }
        ;
        ll.setStyle = function (attrib_value)
        {
            if (that.IsEmpty(attrib_value)) return null;
			if (that.IsEmpty(this.style)) return null;
			
            var styleString=null;
            var styleName=null;
            var styleValue=null;
            styleString = attrib_value.replace(";","");
            styleName = that.camelize(styleString.split(":")[0]);
            
            styleValue = styleString.split(":")[1];
            try
            {
				this.style[styleName]=styleValue;
			}
			catch(err)
			{
				this.style[styleString.split(":")[0]]=styleValue;
			}
		    return this;
        }
        ;
        ll.getStyle = function (attrib_name)
        {
            if (that.IsEmpty(attrib_name)) return null;

            var styleName=null;
            styleName = that.camelize(attrib_name);
            
            return this.style[styleName];
        }
        ;
        ll.pushStyle = function(property_name,property_value)
        {
            if (ari.IsEmpty(property_name)) {return;}
            if (ari.IsEmpty(property_value)) {return;}
            var trim = /^\s+|\s+$/g;
            
            var pn = property_name.replace(trim,"");

            var pv = typeof(property_value)=="string"?property_value.replace(trim,""):property_value;
            
            this.setStyle(pn+":"+pv);            
        }
        ;
        //pushStyles pushes an array of style objects
        //each style object must consist of a name property and a value property
        ll.pushStyles = function(style_array)
        {
            if (ari.IsEmpty(style_array)) return;
            if (typeof(style_array) != "object") return;
            for (var i = 0; i < style_array.length; i++)
            {
                if (!ari.IsEmpty(style_array[i].name) && !ari.IsEmpty(style_array[i].value))
                {
                    this.pushStyle(style_array[i].name, style_array[i].value);
                }
            }
        }
        ;
        ll.popStyle = function(property_name)
        {
            if (ari.IsEmpty(property_name)) return;
            var trim = /^\s+|\s+$|:.+$/g;
            
            var pn = property_name.replace(trim,"");
            
            this.getValues("style");
            
            if (ari.IsEmpty(theValues) || theValues.length==0)
            {
                return;
            }
            var theNewValues = [];
            for (var i = 0; i < theValues.length; i++)
            {
                var theName = theValues[i].split(":")[0].replace(trim,"");
                
                if (theName.toUpperCase() != pn.toUpperCase())
                {
                    theNewValues.push(theValues[i]);
                }
            }
            if (ari.IsEmpty(theNewValues) || theNewValues.length == 0) return;

            this.setStyle(theNewValues.join(";"));
            return;                
        }
        ;
        // pushValue()
        ll.hide = function()
        {
            //this.pushStyle("display","none");
            this.pushStyle("visibility","hidden");
            this.isHidden = true;
            return;
        }
        ;
        // hide()
        ll.show = function()
        {
            //this.pushStyle("display","none");
            this.pushStyle("visibility","visible");
            this.isHidden = false;
            return;
        }
        ;
        // show()
        ll.showHide = function()
        {
            if (this.isHidden) this.show();
            else this.hide();
            return;
        }
        ;
        //addText.  Add text to a given element, append that element to this element.
        //style = optional style to add
        //returnHTML = true if you want the HTML added to the innerHTML rather than created
        //              as a text node
        ll.addText = function(text_to_add, element_type, style, returnHTML)
        {
            
            if (ari.IsEmpty(text_to_add)) return;
            var HasElementType = !(ari.IsEmpty(element_type));
            var HasStyle = !(ari.IsEmpty(style));
            var IsStyleArray = (HasStyle && typeof(style) == "object");
            //explicit and implicit HTML detected
            if (ari.IsEmpty(returnHTML))
            {
                if ((text_to_add.indexOf("<") == -1 || text_to_add.indexOf(">") == -1))
                {
                    returnHTML = false;
                }
                else
                {
                    returnHTML = true;
                }
            }
            var tn = document.createTextNode(text_to_add);
            var theNode = tn;
            if (HasElementType)
            {
                var et = document.createElement(element_type);
                et.appendChild(tn);
                theNode = et;
            }
            if (!returnHTML)
            {
                this.appendChild(theNode);
            }
            var a_node = ari.make(theNode);
            if (IsStyleArray)
            {
				for (var i = 0; i < style.length; i++)
				{
					a_node.pushStyle(style[i].name,style[i].value);
				}
            }
            else
            {
				if (HasStyle)
				{
					a_node.setStyle(style);                
				}
            }
            if (!returnHTML) return a_node;
            this.innerHTML+=a_node.innerHTML;
        }
        ;
        ll.addElement = function(element_type, style)
        {
            if (ari.IsEmpty(element_type)) return;
            var HasStyle = !(ari.IsEmpty(style));
            var IsStyleArray = (HasStyle && typeof(style) == "object");
            var theNode = document.createElement(element_type);
            this.appendChild(theNode);
            var a_node = ari.make(theNode);
            if (IsStyleArray)
            {
				for (var i = 0; i < style.length; i++)
				{
					a_node.pushStyle(style[i].name,style[i].value);
				}
            }
            else
            {
				if (HasStyle)
				{
					a_node.setStyle(style);                
				}
            }
            return a_node;
        }
        ;
        ll.addHtml =  function(html_to_add)
        {
            if (that.IsEmpty(html_to_add)) {return;}
            var ad = html_to_add;
            this.innerHTML+=ad;
            return this;
        }
        ;
        ll.moveTo = function(x_pos,y_pos)
        {
			this.positioning(x_pos,y_pos,"absolute");			
			return;
        }
        ;
        ll.offsetTo = function(x_pos,y_pos)
        {
			this.positioning(x_pos,y_pos,"relative");
			return;
        }
        ;
		ll.positioning = function(x_pos, y_pos, position_type)
		{
			if (ari.IsEmpty(x_pos) || ari.IsEmpty(y_pos) || ari.IsEmpty(position_type)) return;
			var x = x_pos;
			var y = y_pos;
			
			this.pushStyle("position",position_type);
			this.pushStyle("top",y+"px");
			this.pushStyle("left",x+"px");
			
			return;    
		}
		;
		ll.addSelectors = function()
		{
		//associate any number of strings with the variable.
			if (arguments.length > 1)
			{
				if (ari.IsEmpty(this.DataFields)) this.DataFields = [];
				var ary = Array.prototype.slice.call(arguments);
				for (var i = 0 ; i < ary.length; i++)
				{
					this.DataFields.push(ary[i]);
				}
			}
		}
		;
        ll.addSublink=function(full_string,substring_to_link,substring_url,IsTargetBlank,style_array, usesOnClick)
		{
			//if the target doesn't exist, link the whole string
			var szLink=null;
			var hasSubstring=false;
	        var aLink = null;
	        var aSpan = null;
    
			if (!ari.IsEmpty(substring_to_link))
			{
				hasSubstring = full_string.indexOf(substring_to_link)!=-1;
			}
			if (hasSubstring)
			{
			    var txt1 = null;
			    var txt2 = null;
			    var fss = full_string.split(substring_to_link);
			    if (!ari.IsEmpty(fss) && fss.length > 0)
			    {
			        txt1 = document.createTextNode(fss[0]);
			        txt2 = document.createTextNode(fss[1]);
			    }
				aSpan = this.addElement("span");
				//ari returns an orphaned element
		        aLink = ari.addText(substring_to_link, "a", style_array);
		        
		        aSpan.appendChild(txt1);
		        aSpan.appendChild(aLink);
		        aSpan.appendChild(txt2);
			}
			else
			{
			    if (full_string.indexOf("<") != -1 && full_string.indexOf(">") != -1)
			    {
    			    aLink = this.addElement("a");
			        aLink.addHtml(full_string);
			        aLink.pushStyles(style_array);
			    }
			    else
			    {
		            aLink = this.addText(full_string, "a", style_array);
			    }
			}
	        if (ari.IsEmpty(usesOnClick)||!usesOnClick)
	        {
				aLink.setValue("href",substring_url);
	        }
	        else
	        {
				aLink.setValue("onclick",substring_url);
	        }
	        if (!ari.IsEmpty(IsTargetBlank)&& IsTargetBlank)
	        {
				aLink.setValue("target","_blank");
	        }
	        
	        if (!hasSubstring)
	        {
				aLink = ari.make(aLink);
				return aLink;
	        }
	        
	        var newHTML = aSpan.innerHTML.replace(/&lt;/g,"<");
	        newHTML = newHTML.replace(/&gt;/g,">");
	        aSpan.innerHTML = newHTML;
	        aSpan = ari.make(aSpan);
	        
	        return aSpan;
		}// end linkSubstring
		;
        ll.addBreak = function(breaks)
        {
			if (ari.IsEmpty(breaks) || isNaN(breaks))
			{
				breaks = 0;
			}
			for (var i = 0; i < breaks; i++)
			{
				this.addElement("br");
			}
        }
        ;
        ll.makeTable = function(num_cols, num_cells, num_rows)
        {
			
        }
		ll.AriId = this.organonId;
        ll.AriVersion = this.AriVersion;
        ll.DataFields = [];
        // build the userid array
        if (arguments.length > 1)
        {
            var ary = Array.prototype.slice.call(arguments);
            ll.DataFields = ary.slice(1);
        }
        this.organonId++;
        this.organon.push(ll);

        return ll;
    }
    // end make()
    ,
    "showHideAll" : function()
    {
        for (i=0;i<this.organon.length;i++)
        {
            this.organon[i].showHide();
        }
    }
    ,
    "select" : function(data_field)
    {
        if (this.IsEmpty(data_field)) return this.wrapArray(this.organon);

        var return_array = [];
        for (i=0;i<this.organon.length;i++)
        {
            if (typeof(this.organon[i].DataFields) !== "undefined") var df = this.organon[i].DataFields;
            if (df != null)
            {
                for (var j = 0; j < df.length; j++)
                {
                    if (df[j] == data_field) return_array.push(this.organon[i]);
                }
            }
        }

        return this.wrapArray(return_array);
    }    
    ,
    "selectClass" : function(class_name)
    {
        if (this.IsEmpty(class_name)) return this.wrapArray(this.organon);
        var return_array = [];
        for (i=0;i<this.organon.length;i++)
        {
            if (this.organon[i].usesClass(class_name)) return_array.push(this.organon[i]);
        }
        return this.wrapArray(return_array);
    }
    ,
    "selectById" : function(field)
    {
        if (this.IsEmpty(field)) return null;
        if (this.IsEmpty(this.organon) || this.organon.length == 0) return null; 

        var return_array = [];
        for (i=0;i<this.organon.length;i++)
        {
            if (this.organon[i].id.toUpperCase == field.toUpperCase()) return this.organon[i];
        }
        return null;
    }    
    ,
    "wrapArray" : function(raw_array)
    {
        if (typeof(raw_array) != "object")
        {
            return null;
        }
        var r = raw_array;
        //toggle display all elements in the array
        r.showHide = function()
        {            
            for (i=0;i<this.length;i++)
            {
                this[i].showHide();
            }
        }
        ;
        r.show = function()
        {            
            for (i=0;i<this.length;i++)
            {
                this[i].show();
            }
        }
        ;
        r.hide = function()
        {            
            for (i=0;i<this.length;i++)
            {
                this[i].hide();
            }
        }
        ;
        //set a style on all elements in the array
        r.setStyle = function(attrib_value)
        {
            if (ari.IsEmpty(attrib_value)) return;
            for (i=0;i<this.length;i++)
            {
                this[i].setStyle(attrib_value);
            }            
        }
        ;
        //get the first element of an array
        r.first = function()
        {
            if (ari.IsEmpty(this[0])) return null;
            return this[0];
        }
        ;
        //get the first element of an array
        r.pushStyle = function(property_name, property_value)
        {
            if (ari.IsEmpty(property_name) || ari.IsEmpty(property_value)) return null;
            for (i=0;i<this.length;i++)
            {
                this[i].pushStyle(property_name, property_value);
            }            
        }
        ;
        r.moveTo = function(x_pos,y_pos)
        {
            if (ari.IsEmpty(x_pos) || ari.IsEmpty(y_pos)) return null;
            for (i=0;i<this.length;i++)
            {
				this[i].moveTo(x_pos, y_pos);			
            }            
			return;
        }
        ;
        r.offsetTo = function(x_pos,y_pos)
        {
            if (ari.IsEmpty(x_pos) || ari.IsEmpty(y_pos)) return null;
            for (i=0;i<this.length;i++)
            {
				this[i].offsetTo(x_pos, y_pos);			
            }            
			return;
        }
        r.IsWrapped = true;
        return r;
    }
    ,
    "IsEmpty" : function (test_var)
    {
        if (typeof(test_var) === "undefined") return true;
        if (test_var === null) return true;
        if (test_var == "null") return true;
        return false;
    }
    ,
    "addText" : function(text_to_add, element_type, style)
    {
        if (ari.IsEmpty(text_to_add)) return;
        var HasElementType = !(ari.IsEmpty(element_type));
        var HasStyle = !(ari.IsEmpty(style));
        var IsStyleArray = (HasStyle && typeof(style) == "object");
        var tn = document.createTextNode(text_to_add);
        var theNode = tn;
        if (HasElementType)
        {
            var et = document.createElement(element_type);
            et.appendChild(tn);
            theNode = et;
        }
        var a_node = ari.make(theNode);
        if (IsStyleArray)
        {
			for (var i = 0; i < style.length; i++)
			{
				a_node.pushStyle(style[i].name,style[i].value);
			}
        }
        else
        {
			if (HasStyle)
			{
				a_node.setStyle(style);                
			}
        }
        return a_node;
    },
	"camelize" : function(a)
	{
		a = a.toLowerCase();
	    var dash = a.indexOf("-");
	    var camel = a;
		var humper = null;
	    if (dash != -1)
	    {
	        humper = a.split("-");
	        var hump = humper[1].toUpperCase().charAt(0);
	        var rest = humper[1].substring(1);
	        camel = humper[0]+hump+rest;
	    }
	    return camel;
	}
};

//  ---------------------------------------

// end ari
