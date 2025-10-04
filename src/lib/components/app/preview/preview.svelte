<script lang="ts">
	import type { hookJsonPartialSchemaType } from "$lib/schema/webhookContentSchema";
	import SideAvatar from "./side-avatar.svelte";

   const {content}:{content:hookJsonPartialSchemaType} = $props()
</script>
<SideAvatar>
   ชื่อภาพยนตร์
 ภาพยนตร์สัญชาติใด
 ผู้ก ากับภาพยนตร์คือใคร
 สร้ างปี ค.ศ.ใด
 นักแสดงน า คือ
 เป็นภาพยนตร์แนวใด/ เกี่ยวกับอะไร (โครงเรื่อง )
 คุณค่าที่ได้รับจากภาพยนตร์เรื่องนี ้ คือ
</SideAvatar>