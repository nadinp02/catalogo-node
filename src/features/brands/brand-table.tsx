import Link from "next/link";
import { Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/delete-button";
import { deleteBrandAction } from "@/actions/brands/actions";
import type { Brand } from "@/types/catalog";

export function BrandTable({ brands }: { brands: Brand[] }) {
  if (brands.length === 0) {
    return (
      <p className="border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Todavía no hay marcas.
      </p>
    );
  }

  return (
    <div className="overflow-hidden border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brands.map((brand) => (
            <TableRow key={brand.id}>
              <TableCell className="font-medium">{brand.name}</TableCell>
              <TableCell className="text-muted-foreground">{brand.slug}</TableCell>
              <TableCell>
                <Badge variant={brand.isActive ? "success" : "secondary"}>
                  {brand.isActive ? "Activa" : "Inactiva"}
                </Badge>
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  render={
                    <Link href={`/administracion/marcas/${brand.id}/editar`}>
                      <Pencil className="size-3.5" />
                      Editar
                    </Link>
                  }
                />
                <DeleteButton
                  action={deleteBrandAction.bind(null, brand.id)}
                  confirmMessage={`¿Eliminar la marca "${brand.name}"?`}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
