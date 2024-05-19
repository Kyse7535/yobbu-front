export default function useUtils() {
  const compareArrays = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      const obj1 = arr1[i];
      const obj2 = arr2[i];

      // check if objects have same keys
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);
      if (keys1.length !== keys2.length) {
        return false;
      }

      for (let key of keys1) {
        if (!obj2.hasOwnProperty(key)) {
          return false;
        }

        // compare values recursively if they are arrays or objects
        if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
          if (!compareArrays(obj1[key], obj2[key])) {
            return false;
          }
        } else if (
          typeof obj1[key] === "object" &&
          typeof obj2[key] === "object"
        ) {
          if (!compareObjects(obj1[key], obj2[key])) {
            return false;
          }
        } else if (obj1[key] !== obj2[key]) {
          return false;
        }
      }
      return true;
    }
  };
  const compareObjects = (obj1, obj2) => {
    if ((!obj1 || !obj2) && obj1 === obj2) {
      return true;
    }
    if ((!obj1 || !obj2) && obj1 !== obj2) {
      return false;
    }
    // if (obj1 instanceof Array && obj2 instanceof Array) {
    //   return compareArrays(obj1, obj2);
    // }
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
      return false;
    }

    for (let key in obj1) {
      if (obj2.hasOwnProperty(key)) {
        if (typeof obj1[key] === "object" && typeof obj2[key] === "object") {
          return compareObjects(obj1[key], obj2[key]);
        } else if (obj1[key] !== obj2[key]) {
          return false;
        }
      } else {
        return false;
      }
    }

    return true;
  };
  const copyObject = (obj) => {
    if (typeof obj !== "object" || obj === null) {
      return obj;
    }
    if (obj instanceof Set) {
      return new Set([...obj]);
    }
    if (obj instanceof Array) {
      let _array = [];
      for (let element of obj) {
        _array.push(copyObject(element));
      }
      return _array;
    }
    let newObj = {};
    for (let key of Object.keys(obj)) {
      if (typeof obj[key] !== "object") {
        newObj[key] = obj[key];
      } else {
        newObj[key] = copyObject(obj[key]);
      }
    }
    return newObj;
  };
  return {
    compareObjects,
    compareSimpleArrays: (arr1, arr2) => {
      if (arr1.length !== arr2.length) {
        return false;
      }

      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
          return false;
        }
      }

      return true;
    },

    compareArrays,
    generateUUID: () => {
      let d = new Date().getTime();
      let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          let r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
      );
      return uuid;
    },
    rules: {
      required: (value) => !!value || "Required.",
      counter: (value) => value.length <= 20 || "Max 20 characters",
      short_text: (value) => {
        const pattern = /^[a-zA-Z]+$/;
        return pattern.test(value) || "invalid text";
      },
      email: (value) => {
        const pattern =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Invalid e-mail.";
      },
    },
    copyObject,
  };
}
