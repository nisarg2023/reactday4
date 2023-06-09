import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FromAccount, MonthYear, ToAccount, TransactionType } from "../../utils/constants";


export default function AddTransaction({ localFormValue, index, isUpdate }) {
  const initialFormValues = localFormValue || {
    id: "",
    TransactionDate: "",
    MonthYear: "",
    TransactionType: "",
    FromAccount: "",
    ToAccount: "",
    Amount: "",
    Receipt: "",
    ReceiptBase64: "",
    Notes: "",
  };
  const initialFormErr = localFormValue
    ? {
        TransactionDate: "",
        MonthYear: "",
        TransactionType: "",
        FromAccount: "",
        ToAccount: "",
        Amount: "",
        Receipt: "",
        Notes: "",
      }
    : {
        TransactionDate: "*",
        MonthYear: "*",
        TransactionType: "*",
        FromAccount: "*",
        ToAccount: "*",
        Amount: "*",
        Receipt: "*",
        Notes: "*",
      };

  const [formValue, setFormValue] = useState(initialFormValues);
  const [formErr, setFormErr] = useState(initialFormErr);
  const [removeImage, setRemoveImage] = useState(false);
  const FromAccountRef = useRef();
  const ToAccountRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isUpdate) {
      // const id = localStorage.getItem("data")
      //   ? JSON.parse(localStorage.getItem("data")).length + 1
      //   : 1;
      let id;
      if (localStorage.getItem("data")) {
        let data = JSON.parse(localStorage.getItem("data"));
        id = data[data.length - 1].id + 1;
      } else {
        id = 1;
      }

      setFormValue((prev) => {
        return { ...prev, id: id };
      });
    }
  }, []);

  const isEmpty = (input) => {
    if (input.value.trim() === "") {
      setFormErr((prev) => {
        return { ...prev, [input.name]: "this field is required" };
      });
      return true;
    } else {
      setFormErr((prev) => {
        return { ...prev, [input.name]: "" };
      });
      return false;
    }
  };

  const handelOnChange = (input, type) => {
    isEmpty(input);

    switch (type) {
      case "Amount": {
        if (input.value <= 0 && !isEmpty(input)) {
          setFormErr((prev) => {
            return {
              ...prev,
              Amount: "The amount should be greater than zero",
            };
          });
        } else if (!isEmpty(input)) {
          setFormErr((prev) => {
            return {
              ...prev,
              Amount: "",
            };
          });
        }
        break;
      }
      case "Notes":
        {

          if (input.value.length > 250 && !isEmpty(input)) {
            setFormErr((prev) => {
              return {
                ...prev,
                Notes: "notes should not cross 250 characters in length",
              };
            });
           
          }
          else if (!isEmpty(input)) {
            setFormErr((prev) => {
              return {
                ...prev,
                Notes: "",
              };
            });
          }
          break;
        }

      case "FromOrToAccount": {
       
        if (ToAccountRef.current.value === FromAccountRef.current.value) {
          setFormErr((prev) => {
            return {
              ...prev,
              ToAccount: "From and To Account must be different",
            };
          });
        } else {
          setFormErr((prev) => {
            return {
              ...prev,
              ToAccount: "",
            };
          });
        }

        break;
      }
      default: {
        break;
      }
    }
  };

  const handelFile = (File, e) => {
    if (
      !(
        File[0].type === "image/png" ||
        File[0].type === "image/jpg" ||
        File[0].type === "image/jpeg"
      ) ||
      File[0].size > 1000000
    ) {
      setFormErr((prev) => {
        return {
          ...prev,
          Receipt:
            "receipt upload size should not exceed 1 MB, allow only .png .jpg .jpeg ",
        };
      });
    } else {
      setFormErr((prev) => {
        return { ...prev, Receipt: "" };
      });
    }

    //================================================================

    var file = File[0];
    var reader = new FileReader();

    reader.onload = function () {
      let base64String = reader.result;
      console.log(base64String);
      setFormValue((prev) => {
        return { ...prev, ReceiptBase64: base64String };
      });
      //console.log(base64String);
    };
    reader.readAsDataURL(file);

    //================================================================
  };

  const handelRemoveImage = () => {
    setRemoveImage(true);
    setFormValue({ ...formValue, Receipt: "" });
    setFormErr({ ...formErr, Receipt: "*" });
  };

  const handelOnSubmit = (e) => {
    e.preventDefault();
    console.table(formValue);
    let isFormValid = true;

    Object.entries(formErr).forEach((x) => {
      if (x[1] === "*") {
        setFormErr((prev) => {
          return { ...prev, [x[0]]: "this field is required" };
        });
      }
      isFormValid = x[1] === "" && isFormValid;
    });

  
    if (isFormValid) {
      let localData = JSON.parse(localStorage.getItem("data"));
      if (localData) {
        if (isUpdate) {
          localData.splice(index, 1, formValue);
          localStorage.setItem("data", JSON.stringify(localData));
        } else {
          let data = [...localData, formValue];
          localStorage.setItem("data", JSON.stringify(data));
        }
      } else {
        localStorage.setItem("data", JSON.stringify([formValue]));
      }

  

      navigate("/");
    } else {
      alert("some things went wrong");
    }
  };

  return (
    <div>
      <form
        onSubmit={async (e) => {
          handelOnSubmit(e);
        }}
      >
        <div className="formContainer">
          <div className="input_div">
            <div className="left_div">
              <label htmlFor="TransactionDate:">Transaction Date:</label>
            </div>
            <div className="right_div">
              <input
                type="date"
                name="TransactionDate"
                value={formValue.TransactionDate}
                onChange={(e) => {
                  setFormValue({
                    ...formValue,
                    TransactionDate: e.target.value,
                  });
                  handelOnChange(e.target);
                }}
              />
              <span>{formErr.TransactionDate}</span>
            </div>
          </div>

          <div className="input_div">
            <div className="left_div">
              <label htmlFor="MonthYear">Month Year</label>
            </div>
            <div className="right_div">
              <select
                name="MonthYear"
                value={formValue.MonthYear}
                onChange={(e) => {
                  setFormValue({ ...formValue, MonthYear: e.target.value });
                  handelOnChange(e.target);
                }}
              >
                <option value="" desable selectde hidden>
                  select
                </option>
                {MonthYear.map((val) => (
                  <option value={val}>{val}</option>
                ))}
              </select>{" "}
              <span>{formErr.MonthYear}</span>
            </div>
          </div>

          <div className="input_div">
            <div className="left_div">
              <label htmlFor="TransactionType">Transaction Type :</label>
            </div>

            <div className="right_div">
              <select
                name="TransactionType"
                value={formValue.TransactionType}
                onChange={(e) => {
                  setFormValue({
                    ...formValue,
                    TransactionType: e.target.value,
                  });
                  handelOnChange(e.target);
                }}
              >
                <option value="" desable selectde hidden>
                  select
                </option>
                {TransactionType.map((val) => (
                  <option value={val}>{val}</option>
                ))}
              </select>
              <span>{formErr.TransactionType}</span>
            </div>
          </div>

          <div className="input_div">
            <div className="left_div">
              <label htmlFor="FromAccount">FromAccount</label>
            </div>

            <div className="right_div">
              <select
                ref={FromAccountRef}
                name="FromAccount"
                value={formValue.FromAccount}
                onChange={(e) => {
                  setFormValue({ ...formValue, FromAccount: e.target.value });
                  handelOnChange(e.target, "FromOrToAccount");
                }}
              >
                <option value="" desable selectde hidden>
                  select
                </option>
                {FromAccount.map((val) => (
                  <option value={val}>{val}</option>
                ))}
              </select>
              <span>{formErr.FromAccount}</span>
            </div>
          </div>

          <div className="input_div">
            <div className="left_div">
              <label htmlFor="ToAccount">To Account</label>
            </div>

            <div className="right_div">
              <select
                ref={ToAccountRef}
                name="ToAccount"
                value={formValue.ToAccount}
                onChange={(e) => {
                  setFormValue({ ...formValue, ToAccount: e.target.value });
                  handelOnChange(e.target, "FromOrToAccount");
                }}
              >
                <option value="" desable selectde hidden>
                  select
                </option>
                {ToAccount.map((val) => (
                  <option value={val}>{val}</option>
                ))}
              </select>
              <span>{formErr.ToAccount}</span>
            </div>
          </div>

          <div className="input_div">
            <div className="left_div">
              <label htmlFor="Amount">Amount : </label>
            </div>

            <div className="right_div">
              <input
                type="number"
                name="Amount"
                value={formValue.Amount}
                onChange={(e) => {
                  setFormValue({ ...formValue, Amount: e.target.value });
                  handelOnChange(e.target, "Amount");
                }}
              />
              <span>{formErr.Amount}</span>
            </div>
          </div>  

          {
            !isUpdate && 
              <div className="input_div">
                <div className="left_div">
                  <label htmlFor="Receipt : ">Receipt : </label>
                </div>

                <div className="right_div">
                  <input
                    type="file"
                    name="Receipt"
                    onChange={(e) => {
                      setFormValue({ ...formValue, Receipt: e.target.value });
                      handelFile(e.target.files);
                      handelOnChange(e.target);
                    }}
                  />
                  <span>{formErr.Receipt}</span>
                </div>
              </div>
            
          }

          {
            isUpdate && 
              <div className="input_div">
                <div className="left_div">
                  <label htmlFor="Receipt : ">Receipt : </label>
                </div>

                <div className="right_div">
                  {removeImage ? (
                    <>
                      <input
                        type="file"
                        name="Receipt"
                        value={formValue.Receipt}
                        onChange={(e) => {
                          setFormValue({
                            ...formValue,
                            Receipt: e.target.value,
                          });
                          handelFile(e.target.files);
                          handelOnChange(e.target);
                        }}
                      />
                      <span>{formErr.Receipt}</span>
                    </>
                  ) : (
                    <>
                      <img
                        style={{ width: "200px" }}
                        src={formValue.ReceiptBase64}
                        alt="..."
                      />

                      <input
                        type="button"
                        value="remove"
                        onClick={() => handelRemoveImage()}
                      />
                    </>
                  )}
                </div>
              </div>
          
          }

          <div className="input_div">
            <div className="left_div">
              <label htmlFor="Notes">Notes</label>
            </div>
            <div className="right_div">
              <textarea
                name="Notes"
                id=""
                cols="20"
                rows="3"
                value={formValue.Notes}
                onChange={(e) => {
                  setFormValue({ ...formValue, Notes: e.target.value });
                  handelOnChange(e.target, "Notes");
                }}
              ></textarea>
              <span>{formErr.Notes}</span>
            </div>
          </div>

          <div>
            <input type="submit" value="submit" />
          </div>
        </div>
      </form>

      <Link to="/">All Transaction </Link>
    </div>
  );
}

// const Input = (props) => {

//   let inputField = <input type="text" />;
//   switch (props.type) {
//     case "textarea": {
//       inputField = <textarea name="" id="" cols="15" rows="3"></textarea>;
//       break;
//     }
//     case "select": {
//       inputField = (
//         <select name={props.name}>
//           {props.option.map((value) => {
//             return (
//               <option name={value} value={value}>
//                 {value}
//               </option>
//             );
//           })}
//         </select>
//       );
//       break;
//     }
//     default: {
//       inputField = <input type={props.type} placeholder={props.placeholder} />;
//     }
//   }

//   return (
//     <div>
//       <label htmlFor="">{props.label}</label>
//       {inputField}
//       <span></span>
//     </div>
//   );
// };
