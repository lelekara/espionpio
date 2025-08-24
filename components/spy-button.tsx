"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";


export function SpyButton() {

  return <Button ><Link href={"/protected"}>mode espion</Link></Button>;
}
