from app.models import Department

# If the validated_data contains a department id or a null department, update it
def update_department_id(instance, validated_data):
    department_id = validated_data.get("department")
    if department_id != None:
        department = Department.objects.get(id = department_id)
        instance.department = department
    elif "department" in validated_data:
        instance.department = None
