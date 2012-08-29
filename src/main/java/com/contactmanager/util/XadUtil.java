package com.contactmanager.util;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.google.common.collect.Lists;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class XadUtil {
    public static final String DEFAULT_DATE_PATTERN = "yyyy-MM-dd";

    public static String fixNull(String ... values) {
        if (values.length == 0) {
            return "";
        }
        for (String value : values) {
            if (value != null && !value.trim().equals("")) {
               return value.trim();
            }
        }
        return "";
    }
    
    public static String toString(Object obj) {
    	return obj == null ? "" : obj.toString();
    }
    
    public static String cut(String str, int chars) {
    	return 	str == null  ? null  :
    			str.length() < chars ?
    			str          : str.substring(0, chars-1);
    }
    
    // this is just like Arrays,asList, but the returned list is Mutable
    public static <T> List<T> asList(T... elems) {
    	List<T> list = Lists.newArrayList();
    	for(T t: elems) {
    		list.add(t);
    	}
    	return list;
    }
    
    public static boolean getBoolean(Boolean b, boolean defaultVal) {
    	return b == null ? defaultVal : b.booleanValue(); 
    }
    
    public static int getInt(Object obj, int defaultVal) {
    	if(obj == null) {
    		return defaultVal;
    	}
    	
    	if(obj instanceof String) {
    		return getInt(obj.toString(), defaultVal);
    	} else if(obj instanceof Integer) {
    		return ((Integer) obj).intValue();
    	}
    	
    	return defaultVal;
    }
    
    public static int getInt(String str, int defaultVal) {
    	try {
    		return Integer.parseInt(str);
    	} catch(Exception e) {
    		return defaultVal;
    	}
    }

    public static String encode(String string) {
		try {
			return URLEncoder.encode(string, "UTF-8");
		} catch(Exception e) {
			return null;
		}
	}
    
    public static String formatDate2String(Date date) {
        if (date == null) {
            return "";
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        return sdf.format(date);
    }

    public static List jsonArrayToList(String jsonObjs) {
        List objList = new ArrayList();
        JSONObject jsonObj = JSONObject.fromObject(jsonObjs);
        for (int i = 0; i < jsonObj.size(); i++) {
            JSONArray objArray = jsonObj.getJSONArray("obj" + i);
            JSONObject obj = JSONObject.fromObject(objArray.get(0));
            objList.add(obj);
        }
        return objList;
    }

    public static final String[] csvToJsonObjs(String csvString) {
        if (csvString == null || csvString == "") {
            return null;
        } else {
            if (csvString.indexOf("\r\n") != -1) {
                String[] records = csvString.split("\r\n");
                String[] head = records[0].split(",");
                String[] jsonObjs = new String[records.length - 1];
                for (int i = 1; i < records.length; i++) {
                    String jsonObj = "{";
                    String[] record = records[i].split(",");
                    for (int j = 0; j < record.length; j++) {
                        jsonObj += "\"" + head[j] + "\":\"" + record[j] + "\"";
                        if (j != record.length - 1)
                            jsonObj += ",";
                    }
                    jsonObj += "}";
                    jsonObjs[i - 1] = jsonObj;
                }
                return jsonObjs;
            }
            return null;
        }
    }
    
    public static final  byte[] InputStreamToByte(InputStream is) throws IOException {  
    	ByteArrayOutputStream bytestream = new ByteArrayOutputStream();  
    	int ch;  
    	while ((ch = is.read()) != -1) {  
    		bytestream.write(ch);  
    	}  
    	byte imgdata[] = bytestream.toByteArray();  
    	bytestream.close();  
   
    	return imgdata;  
    }	
    
    public static void sleep(long millis) {
    	try {
    		Thread.sleep(millis);
    	}catch(Exception e) {}
    }
}
