import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
let source=process.env.NOTION_WIDGETS_SOURCE;
if(!source){const scratch=mkdtempSync(join(tmpdir(),'notion-widgets-build-'));source=join(scratch,'source');try { execFileSync('git',['clone','--depth','1','--branch','main','https://github.com/handeesome/notion-widgets.git',source],{stdio:'inherit'}); } catch(error) { if(['questions','gallery','weather'].every(w=>existsSync(join(root,'public','widgets',w,'index.html')))){console.warn('Widget source unavailable; using the checked-in widget snapshot.');process.exit(0);} throw error; }}
const tracked=new Set(execFileSync('git',['-C',resolve(source),'ls-files'],{encoding:'utf8'}).split(/\r?\n/));
for(const widget of ['questions','gallery','weather']){
 const from=join(resolve(source),widget),to=join(root,'public','widgets',widget);
 if(!existsSync(join(from,'index.html')))throw Error('Widget source is incomplete: '+widget);
 mkdirSync(to,{recursive:true});
 for(const entry of readdirSync(from,{withFileTypes:true})){
  if(entry.isFile() && tracked.has(widget+'/'+entry.name) && /\.(html|js|css|svg|png|jpg|jpeg|webp|woff2?|json)$/i.test(entry.name))cpSync(join(from,entry.name),join(to,entry.name));
 }
}
console.log('Synced Notion widgets to public/widgets.');
