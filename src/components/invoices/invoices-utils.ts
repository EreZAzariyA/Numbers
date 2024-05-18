import invoicesServices from "../../services/invoices";
import { getInvoicesTotalsPrice } from "../../utils/helpers";

export const getUserInvoicesByCategoryId = async (category_id: string, user_id: string): Promise<number> => {
  const invoices = await invoicesServices.fetchInvoicesByUserId(user_id);
  const total = getInvoicesTotalsPrice(invoices);
  return total.spent;
};

