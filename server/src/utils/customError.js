export function ParsedError(res, parsed){
    return res.status(400).json({
        error:`Invalid Payload.`,
        message:JSON.stringify(parsed.error)
    });
};