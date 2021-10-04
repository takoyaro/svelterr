import retrace from 'retrace';
/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ params,query }) {
	// the `slug` parameter is available because this file
	// is called [slug].json.js
	const { slug } = params;
    let q:URLSearchParams = query;
    let stack = q.get('stack');
    const sourceMapRegex = /sourceMappingURL\=data:application\/json;base64,(.*?)$/g;
    const req = await fetch(slug);
    const res = await req.text();
    let pathChunks = import.meta.url.split('\\');
    let routeIndex = pathChunks.indexOf('routes');
    let ProjectPath = pathChunks.slice(0,routeIndex-1).join('/');
    let filePathOnDisk = ProjectPath+slug.replace(/http.*?:\d+/g,'');
    let _sourcemap:string|RegExpExecArray = sourceMapRegex.exec(res);
    if(_sourcemap){
        if(_sourcemap.length){
            _sourcemap=Buffer.from(_sourcemap[1],'base64').toString();
            retrace.register(slug, _sourcemap);
            let remappedStack = await retrace.map(stack);
            let [err,_stack] = remappedStack.replace(/\n/g,'').split('at');
            let [file,line,col]  = _stack.split(':');
            return {
                body:{
                    err:err,
                    file:file,
                    line:+line,
                    col:+col,
                    fileOnDisk:filePathOnDisk
                }
            }
        }
    }
    else{
        console.log("No source map?!")
    }
	
}