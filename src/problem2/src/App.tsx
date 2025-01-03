import { Button, Input } from "@nextui-org/react";
import { usePrices } from "./hooks/usePrices";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCallback, useMemo, useState } from "react";
import { Key } from "@react-types/shared";
import { CurrencyAutocomplete } from "./components";
import { ArrowsRightLeftIcon } from "@heroicons/react/16/solid";

type FormType = {
  amount: string;
  fromCurrency: string;
  toCurrency: string;
};

function App() {
  const { data } = usePrices();
  const [loading, setLoading] = useState<boolean>(false);

  const initialValues: FormType = useMemo(() => {
    return {
      amount: "1",
      fromCurrency: data[0]?.currency || "",
      toCurrency: data[1]?.currency || "",
    };
  }, [data]);

  const validationSchema = Yup.object({
    fromCurrency: Yup.string()
      .required("Select source currency."),
    toCurrency: Yup.string()
      .required("Select target currency."),
    amount: Yup.number()
      .required("Please enter the amount to convert.")
      .positive("The amount must be greater than 0.")
      .typeError("Invalid amount."),
  });

  const handleSubmitForm = useCallback(async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  const {
    values,
    isValid,
    errors,
    touched,
    setFieldValue,
    setValues,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    enableReinitialize: true,
    validateOnBlur: true,
    onSubmit: handleSubmitForm,
  });

  const handleChangeCurrency = useCallback(
    (name: string) => (value: Key | null) => {
      const existingCurrency = data.find((item) => item.currency === value);
      if (value !== null && existingCurrency) {
        setFieldValue(name, value);
      }
    },
    [data, setFieldValue]
  );

  const getPrice = useCallback(
    (currency: string): number | undefined => {
      const currencyData = data.find((item) => item.currency === currency);
      return currencyData ? currencyData.price : undefined;
    },
    [data]
  );

  const swapCurrencies = useCallback(
    (fromCurrency: string, toCurrency: string, amount: number): string => {
      const fromPrice = getPrice(fromCurrency);
      const toPrice = getPrice(toCurrency);

      if (!fromPrice || !toPrice) {
        return "";
      }

      if (fromPrice === toPrice) {
        return `${amount}`;
      }

      const convertedAmount = (amount * fromPrice) / toPrice;
      return `${convertedAmount.toFixed(6)}`;
    },
    [getPrice]
  );

  const handleSwap = useCallback(() => {
    setValues((prevValues) => ({
      ...prevValues,
      fromCurrency: values.toCurrency,
      toCurrency: values.fromCurrency,
    }));
  }, [setValues, values.fromCurrency, values.toCurrency]);

  return (
    <main>
      <div className="relative isolate pt-14">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div className="py-24 sm:py-32 lg:pb-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:max-w-5xl text-center">
              <h1 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-7xl">
                Fancy Currency Swap
              </h1>
              <p className="mt-8 text-pretty text-lg font-medium text-gray-400 sm:text-xl/8">
                Quickly swap currencies with ease. Select and convert instantly!
              </p>
            </div>
            <form
              className="mx-auto w-full mt-16 sm:mt-20 bg-white shadow-2xl rounded-2xl p-8"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-3 xl:grid-cols-2">
                <Input
                  disabled={loading}
                  label="Amount"
                  labelPlacement="inside"
                  placeholder="0.00"
                  type="number"
                  value={values.amount}
                  name="amount"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  radius="sm"
                  errorMessage={errors.amount}
                  isInvalid={
                    (errors?.amount ?? "").length > 0 && touched.amount
                  }
                />
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-x-3 gap-y-2 sm:col-span-2 xl:col-span-1">
                  <CurrencyAutocomplete
                    label="From"
                    isDisabled={loading}
                    onSelectionChange={handleChangeCurrency("fromCurrency")}
                    data={data}
                    name="fromCurrency"
                    onBlur={handleBlur}
                    value={values.fromCurrency}
                    placeholder="Choose a currency"
                    errorMessage={errors.fromCurrency}
                    isInvalid={
                      (errors?.fromCurrency ?? "").length > 0 &&
                      touched.fromCurrency
                    }
                  />
                  <div className="flex justify-center items-center max-h-14">
                    <ArrowsRightLeftIcon
                      className="h-6 w-6 cursor-pointer xl:hover:text-primary-600 rotate-90 md:rotate-0"
                      onClick={handleSwap}
                    />
                  </div>
                  <CurrencyAutocomplete
                    name="toCurrency"
                    label="To"
                    isDisabled={loading}
                    onBlur={handleBlur}
                    onSelectionChange={handleChangeCurrency("toCurrency")}
                    data={data}
                    value={values.toCurrency}
                    placeholder="Choose a currency"
                    errorMessage={errors.toCurrency}
                    isInvalid={
                      (errors?.toCurrency ?? "").length > 0 &&
                      touched.toCurrency
                    }
                  />
                </div>
              </div>
              <div className="mt-6 xl:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <div className="flex items-start flex-col justify-center gap-y-2">
                  {isValid && (
                    <>
                      <p className="text-xl lg:text-2xl font-semibold text-pretty">
                        {values.amount} {values.fromCurrency} ={" "}
                        <span className="text-primary-600">
                          {swapCurrencies(
                            values.fromCurrency,
                            values.toCurrency,
                            Number(values.amount)
                          )}
                        </span>{" "}
                        {values.toCurrency}
                      </p>
                      <p className="text-xs">
                        1 {values.fromCurrency} ={" "}
                        {swapCurrencies(
                          values.fromCurrency,
                          values.toCurrency,
                          1
                        )}{" "}
                        {values.toCurrency}
                      </p>
                    </>
                  )}
                </div>
                <div className="flex items-center justify-center sm:justify-end w-full min-h-14">
                  <Button
                    type="submit"
                    color="primary"
                    className="px-8"
                    radius="full"
                    isLoading={loading}
                  >
                    CONFIRM SWAP
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
